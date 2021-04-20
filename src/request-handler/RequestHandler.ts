import { IncomingMessage, ServerResponse } from 'http';

import {
    Directive,
    DirectiveType,
    Middleware,
    MiddlewareContext,
    MiddlewareReturn,
    Pipeline,
} from '@cardboardrobots/pipeline';
import { Color } from '@cardboardrobots/console-style';

import {
    auto,
    AutoDirective,
    error,
    ErrorDirective,
    json,
    JsonDirective,
    RawDirective,
    ResponseDirective,
    TextDirective,
    view,
    ViewDirective,
} from '../directive';
import { Header } from '../header';

import { Context } from './Context';
import { LogLevel } from './LogLevel';
import { ErrorMessage, NonStringViewError, SierraError } from './Errors';

const DEFAULT_TEMPLATE = 'index';
const ERROR_TEMPLATE = 'error';

export type ViewContext<CONTEXT extends Context, VALUE> = CONTEXT & { view: ViewDirective<VALUE> };
export type ErrorContext<CONTEXT extends Context> = CONTEXT & { error: Error };

export class RequestHandler<CONTEXT extends Context = Context, RESULT = void> {
    pipeline: Pipeline<Context, void, CONTEXT, RESULT> = new Pipeline();
    errorPipeline: Pipeline<ErrorContext<CONTEXT>, any, any, any> = new Pipeline();
    viewPipeline: Pipeline<ViewContext<CONTEXT, RESULT>, RESULT, any, any> = new Pipeline();
    logging: LogLevel = LogLevel.Errors;
    defaultTemplate = DEFAULT_TEMPLATE;

    callback = async (request: IncomingMessage, response: ServerResponse) => {
        const context = new Context(request, response);
        try {
            const result = await this.pipeline.run(context as any, undefined);
            // If Headers have already sent, we cannot send.
            if (!context.response.headersSent && !context.response.writableEnded) {
                this.send(context as CONTEXT, result);
            }
        } catch (err) {
            const errorContext: ErrorContext<CONTEXT> = context as any;
            const wrappedError = err instanceof Error ? err : new Error(err);
            errorContext.error = wrappedError;
            let errorStatus = 500;
            if (wrappedError instanceof SierraError) {
                switch (wrappedError.message) {
                    case ErrorMessage.NoRouteFound:
                    case ErrorMessage.NotFound:
                        errorStatus = 404;
                        break;
                }
            }
            if (this.errorPipeline.middlewares.length) {
                try {
                    const result = await this.errorPipeline.run(errorContext, wrappedError);
                    switch (result.type) {
                        case DirectiveType.Exit:
                        case DirectiveType.End: {
                            const wrappedError =
                                result.value instanceof Error
                                    ? result.value
                                    : new Error(result.value);
                            this.sendError(
                                errorContext,
                                error(wrappedError, { status: errorStatus })
                            );
                            break;
                        }
                        default:
                            this.send(errorContext, result);
                            break;
                    }
                } catch (err) {
                    const wrappedWrror = err instanceof Error ? err : Error(err);
                    errorContext.error = wrappedWrror;
                    this.sendError(errorContext, error(wrappedWrror, { status: errorStatus }));
                }
            } else {
                this.sendError(errorContext, error(wrappedError, { status: errorStatus }));
            }
        }
    };

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
            const { value } = await this.viewPipeline.run(viewContext, directive.value);
            // Ensure output is a string
            if (typeof value !== 'string') {
                throw new NonStringViewError(value);
            }

            this.log(context, options.status);

            return this.write(context, value, options.status, {
                'Content-Type': 'text/html',
                ...options.header,
            });
        } catch (err) {
            this.log(context, 500);

            const result = await this.write(context, errorTemplate(err), 500, {
                'Content-Type': 'text/html',
                ...options.header,
            });

            if (this.logging >= LogLevel.Errors) {
                console.error(err);
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
            if (this.logging >= LogLevel.Errors) {
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
        } catch (err) {
            if (this.logging >= LogLevel.Errors) {
                console.error(err);
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
                // TODO: Should this be Json or Auto?
                // This case should not happen
                return this.sendAuto(context, auto(directive.value));
            }
        } else {
            // TODO: Should this be Json or Auto?
            return this.sendAuto(context, auto(directive.value));
        }
    }

    log(context: Context, status = 500) {
        if (this.logging >= LogLevel.Verbose) {
            console.log(context.request.method, context.request.url, colorStatus(status));
        }
    }

    use(middleware: Middleware<CONTEXT, RESULT, RESULT>): this;
    use<NEWDATA extends Record<string, unknown>, NEWRESULT = RESULT>(
        middleware: Middleware<CONTEXT & Context<Partial<NEWDATA>>, RESULT, NEWRESULT>
    ): RequestHandler<CONTEXT & Context<NEWDATA>, NEWRESULT>;

    use<MIDDLEWARE extends Middleware<any, any, any>>(
        middleware: MIDDLEWARE
    ): RequestHandler<CONTEXT & MiddlewareContext<MIDDLEWARE>, MiddlewareReturn<MIDDLEWARE>>;

    use(middleware: Middleware<any, any, any>): any {
        this.pipeline.use(middleware);
        return this as any;
    }

    useError<NEWRESULT>(middlware: Middleware<ErrorContext<CONTEXT>, Error, NEWRESULT>) {
        return this.errorPipeline.use<ErrorContext<CONTEXT>, NEWRESULT>(middlware);
    }

    useView<NEWRESULT>(middlware: Middleware<ViewContext<CONTEXT, NEWRESULT>, RESULT, NEWRESULT>) {
        return this.viewPipeline.use(middlware);
    }

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
        } finally {
            await new Promise<void>((resolve) => {
                response.end(() => resolve());
            });
        }
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
