import { IncomingMessage, ServerResponse } from 'http';

import { Color } from '../utils/ConsoleUtil';
import {
    Directive,
    DirectiveType,
    Middleware,
    MiddlewareContext,
    MiddlewareReturn,
    Pipeline,
} from '../pipeline';

import { Context } from './Context';
import {
    auto,
    AutoDirective,
    error,
    ErrorDirective,
    json,
    JsonDirective,
    RawDirective,
    ResponseDirective,
    ResponseDirectiveType,
    TextDirective,
    view,
    ViewDirective,
} from './response-directive';
import { LogLevel } from './LogLevel';
import { ErrorMessage, NonStringViewError, NoViewTemplateError, SierraError } from './Errors';
import { Header } from './header';

const DEFAULT_TEMPLATE = 'index';
const ERROR_TEMPLATE = 'error';

export type ViewContext<CONTEXT extends Context, VALUE> = CONTEXT & { view: ViewDirective<VALUE> };
export type ErrorContext<CONTEXT extends Context> = CONTEXT & { error: Error };

export class RequestHandler<CONTEXT extends Context = Context, RESULT = void> {
    pipeline: Pipeline<CONTEXT, undefined, RESULT> = new Pipeline();
    errorPipeline: Pipeline<ErrorContext<CONTEXT>, any, any> = new Pipeline();
    viewPipeline: Pipeline<ViewContext<CONTEXT, RESULT>, RESULT, any> = new Pipeline();
    logging: LogLevel = LogLevel.errors;
    defaultTemplate = DEFAULT_TEMPLATE;

    callback = async (request: IncomingMessage, response: ServerResponse) => {
        let context = new Context(request, response);
        try {
            let result = await this.pipeline.run(context as any, undefined);
            // If Headers have already sent, we cannot send.
            if (!context.response.headersSent && !context.response.writableEnded) {
                this.send(context as CONTEXT, result);
            }
        } catch (e) {
            const errorContext: ErrorContext<CONTEXT> = context as any;
            if (!(e instanceof Error)) {
                e = Error(e);
            }
            errorContext.error = e;
            let errorStatus = 500;
            if (e instanceof SierraError) {
                switch (e.message) {
                    case ErrorMessage.noRouteFound:
                    case ErrorMessage.notFound:
                        errorStatus = 404;
                        break;
                }
            }
            if (this.errorPipeline.middlewares.length) {
                try {
                    let result = await this.errorPipeline.run(errorContext, e);
                    switch (result.type) {
                        case DirectiveType.End:
                        case DirectiveType.End: {
                            const e =
                                result.value instanceof Error
                                    ? result.value
                                    : new Error(result.value);
                            this.sendError(errorContext, error(e, { status: errorStatus }));
                            break;
                        }
                        default:
                            this.send(errorContext, result);
                            break;
                    }
                } catch (e) {
                    if (!(e instanceof Error)) {
                        e = Error(e);
                    }
                    errorContext.error = e;
                    this.sendError(errorContext, error(e, { status: errorStatus }));
                }
            } else {
                this.sendError(errorContext, error(e, { status: errorStatus }));
            }
        }
    };

    private async write<T>(context: Context, value: T, status: number, header: Header) {
        const { response } = context;
        response.statusCode = status;

        Object.keys(header).forEach((headerName) => {
            const value = header[headerName as never] as string;
            response.setHeader(headerName, value);
        });

        try {
            const result = await new Promise<boolean>((resolve, reject) => {
                const result = response.write(value, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
            return result;
        } catch (e) {
            throw e;
        } finally {
            await new Promise<void>((resolve) => {
                response.end(() => resolve());
            });
        }
    }

    sendJson<T = RESULT>(context: CONTEXT, directive: JsonDirective<T>) {
        const { value, options } = directive;

        this.log(context, options.status);

        return this.write(context, JSON.stringify(value ?? null), options.status, {
            'Content-Type': 'application/json',
            ...options.header,
        });
    }

    sendRaw<T = RESULT>(context: CONTEXT, directive: RawDirective<T>) {
        const { value, options } = directive;

        this.log(context, options.status);

        if (typeof value === 'string') {
            return this.write(context, value, options.status, {
                'Content-Type': options.contentType ?? 'text/plain',
                ...options.header,
            });
        } else if (Buffer.isBuffer(value)) {
            return this.write(context, value, options.status, {
                'Content-Type': options.contentType ?? 'octet-stream',
                ...options.header,
            });
        } else {
            return this.write(context, JSON.stringify(value ?? null), options.status, {
                'Content-Type': options.contentType ?? 'application/json',
                ...options.header,
            });
        }
    }

    sendText<T = RESULT>(context: CONTEXT, directive: TextDirective<T>) {
        const { value, options } = directive;

        this.log(context, options.status);

        let output: string;

        if (typeof value === 'object') {
            output = JSON.stringify(value ?? null);
        } else {
            output = `${value ?? ''}`;
        }

        return this.write(context, output, options.status, {
            'Content-Type': 'text/plain',
            ...options.header,
        });
    }

    async sendView(context: CONTEXT, directive: ViewDirective<RESULT>) {
        const { options } = directive;

        try {
            context.template = options.template ?? context.template ?? this.defaultTemplate;
            const viewContext: ViewContext<CONTEXT, RESULT> = context as any;
            viewContext.view = directive;
            let { value } = await this.viewPipeline.run(viewContext, directive.value);
            // Ensure output is a string
            if (typeof value !== 'string') {
                throw new NonStringViewError(value);
            }

            this.log(context, options.status);

            return this.write(context, value, options.status, {
                'Content-Type': 'text/html',
                ...options.header,
            });
        } catch (e) {
            this.log(context, 500);

            const result = await this.write(context, errorTemplate(e), 500, {
                'Content-Type': 'text/html',
                ...options.header,
            });

            if (this.logging >= LogLevel.errors) {
                console.error(e);
            }
            return result;
        }
    }

    async sendAuto(context: CONTEXT, directive: AutoDirective<RESULT>) {
        const { accept } = context;
        if (this.viewPipeline.middlewares.length && accept && accept.indexOf('text/html') > -1) {
            const { value, options } = directive;
            this.sendView(context, view(value, options));
        } else if (accept && accept.indexOf('application/json')) {
            this.sendJson(context, directive);
        } else {
            this.sendRaw(context, directive);
        }
    }

    async sendError<T extends Error>(context: CONTEXT, directive: ErrorDirective<T>) {
        const { accept } = context.request.headers;
        const { value, options } = directive;
        const { status, header } = options;
        if (Math.floor(status / 100) === 5) {
            if (this.logging >= LogLevel.errors) {
                console.error(value);
            }
        }
        try {
            if (
                this.viewPipeline.middlewares.length &&
                accept &&
                accept.indexOf('text/html') > -1
            ) {
                // TODO: Fix sendView for Error
                await this.sendView(
                    context,
                    view(value.message, { status, header, template: ERROR_TEMPLATE }) as any
                );
            } else {
                this.sendJson(context, json(value.message ?? value.name, { status, header }));
            }
        } catch (e) {
            if (this.logging >= LogLevel.errors) {
                console.error(e);
            }
        }
    }

    send(context: CONTEXT, directive: Directive<RESULT>) {
        if (directive instanceof ResponseDirective) {
            if (directive instanceof JsonDirective) {
                return this.sendJson(context, directive);
            } else if (directive instanceof RawDirective) {
                return this.sendRaw(context, directive);
            } else if (directive instanceof ViewDirective) {
                return this.sendView(context, directive);
            } else if (directive instanceof AutoDirective) {
                return this.sendAuto(context, directive);
            } else if (directive instanceof TextDirective) {
                return this.sendText(context, directive);
            } else if (directive instanceof ErrorDirective) {
                return this.sendError(context, directive);
            } else {
                return this.sendAuto(context, directive);
            }
        } else {
            // TODO: Should this be Json or Auto?
            return this.sendAuto(context, auto(directive.value));
        }
    }

    // TODO: Remove data parameter
    log<T>(context: CONTEXT, _data: T, status: number = 500) {
        if (this.logging >= LogLevel.verbose) {
            console.log(context.request.method, context.request.url, colorStatus(status));
        }
    }

    use<NEW_DATA, NEW_RESULT = RESULT>(
        middleware: Middleware<CONTEXT & Context<NEW_DATA>, RESULT, NEW_RESULT>
    ): RequestHandler<CONTEXT & Context<NEW_DATA>, NEW_RESULT>;
    use<MIDDLEWARE extends Middleware<any, any, any>>(
        middleware: MIDDLEWARE
    ): RequestHandler<CONTEXT & MiddlewareContext<MIDDLEWARE>, MiddlewareReturn<MIDDLEWARE>>;
    use(middleware: Middleware<any, any, any>): any {
        this.pipeline.use(middleware);
        return this as any;
    }

    useError<NEW_RESULT>(middlware: Middleware<ErrorContext<CONTEXT>, Error, NEW_RESULT>) {
        return this.errorPipeline.use<ErrorContext<CONTEXT>, NEW_RESULT>(middlware);
    }

    useView<NEW_RESULT>(
        middlware: Middleware<ViewContext<CONTEXT, NEW_RESULT>, RESULT, NEW_RESULT>
    ) {
        return this.viewPipeline.use(middlware);
    }
}

export function errorTemplate(error: any) {
    return `<!DOCTYPE html>
<html>
    <head>
        <title>Sierra Error</title>
    </head>
    <body>
        <h1>Sierra Error</h1>
        <pre><code>${error}</code></pre>
    </body>
</html>`;
}

export function colorStatus(status: number) {
    switch (Math.floor(status / 100)) {
        case 1:
            return Color.white(status);
        case 2:
            return Color.green(status);
        case 3:
            return Color.blue(status);
        case 4:
            return Color.yellow(status);
        case 5:
            return Color.red(status);
        default:
            return Color.brightBlack(status);
    }
}
