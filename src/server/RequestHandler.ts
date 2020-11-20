import { IncomingMessage, ServerResponse } from 'http';

import { Color } from '../utils/ConsoleUtil';
import { Middleware, Pipeline } from '../pipeline';

import { Context } from './Context';
import { OutgoingMessage, OutputType } from './OutgoingMessage';
import { LogLevel } from './LogLevel';
import { ErrorMessage, NonStringViewError, NoViewTemplateError, SierraError } from './Errors';

const DEFAULT_TEMPLATE = 'index';
const ERROR_TEMPLATE = 'error';

export class RequestHandler {
    pipeline: Pipeline<Context, any, any> = new Pipeline();
    errorPipeline: Pipeline<Context, any, any> = new Pipeline();
    viewPipeline: Pipeline<Context, any, any> = new Pipeline();
    logging: LogLevel = LogLevel.errors;
    defaultTemplate = DEFAULT_TEMPLATE;

    callback = async (request: IncomingMessage, response: ServerResponse) => {
        let context = new Context(request, response);
        try {
            let result = await this.pipeline.run(context, undefined);
            // If Headers have already sent, we cannot send.
            if (!context.response.headersSent && !context.response.writableEnded) {
                if (result instanceof OutgoingMessage) {
                    this.send(context, result.data, result.status, result.type, result.template, result.contentType);
                } else {
                    this.send(context, result);
                }
            }
        }
        catch (e) {
            let errorStatus = 500;
            if (e instanceof SierraError) {
                switch (e.message) {
                    case ErrorMessage.noRouteFound:
                    case ErrorMessage.notFound:
                        errorStatus = 404;
                        break;
                }
            }
            try {
                let result = await this.errorPipeline.run(context, e);
                if (result instanceof OutgoingMessage) {
                    this.send(context, result.data, result.status, result.type, result.template, result.contentType);
                } else {
                    this.send(context, result, errorStatus, 'auto', ERROR_TEMPLATE);
                }
            }
            catch (e) {
                this.sendError(context, e, errorStatus);
            }
        }
    };

    sendJson<T>(context: Context, data: T, status: number = 200) {
        this.log(context, data, status);
        context.response.statusCode = status;
        context.response.setHeader('Content-Type', 'application/json');
        context.response.write(JSON.stringify(data ?? null));
        context.response.end();
    }

    sendRaw<T>(context: Context, data: T, status: number = 200, contentType?: string) {
        this.log(context, data, status);
        context.response.statusCode = status;
        if (typeof data === 'string') {
            context.response.setHeader('Content-Type', contentType ?? 'text/plain');
            context.response.write(data);
        } else if (Buffer.isBuffer(data)) {
            context.response.setHeader('Content-Type', contentType ?? 'octet-stream');
            context.response.write(data);
        } else {
            context.response.setHeader('Content-Type', contentType ?? 'application/json');
            context.response.write(JSON.stringify(data ?? null));
        }
        context.response.end();
    }

    async sendView<T>(context: Context, data: T, status: number = 200, template?: string) {
        try {
            context.template = context.template ?? template ?? this.defaultTemplate;
            let output = await this.viewPipeline.run(context, data);
            // Ensure output is a string
            if (typeof output !== 'string') {
                throw new NonStringViewError(output);
            }
            this.log(context, data, status);
            context.response.statusCode = status;
            context.response.setHeader('Content-Type', 'text/html');
            context.response.write(output);
            context.response.end();
        }
        catch (e) {
            this.log(context, data, 500);
            context.response.statusCode = 500;
            context.response.setHeader('Content-Type', 'text/html');
            context.response.write(errorTemplate(e));
            context.response.end();
            if (this.logging >= LogLevel.errors) {
                console.error(e);
            }
        }
    }

    send<T>(context: Context, data: T, status: number = 200, type: OutputType = 'auto', template?: string, contentType?: string) {
        context.cookies.setCookies(context.response);
        let accept = context.accept;
        switch (type) {
            case 'auto':
                if (this.viewPipeline.middlewares.length && accept && accept.indexOf('text/html') > -1) {
                    this.sendView(context, data, status, template);
                } else if (accept && accept.indexOf('application/json')) {
                    this.sendJson(context, data, status);
                } else {
                    this.sendRaw(context, data, status, contentType);
                }
                break;
            case 'json':
                this.sendJson(context, data, status);
                break;
            case 'raw':
                this.sendRaw(context, data, status, contentType);
                break;
            case 'text':
                this.sendRaw(context, data, status, 'text/plain');
                break;
            case 'view':
                this.sendView(context, data, status, template);
                break;
            default:
                this.sendRaw(context, data, status, contentType);
                break;
        }
    }

    async sendError<T>(context: Context, data: Error, status: number = 500) {
        const { accept } = context.request.headers;
        if (!(data instanceof Error)) {
            data = new Error(data);
        }
        if (Math.floor(status / 100) === 5) {
            if (this.logging >= LogLevel.errors) {
                console.error(data);
            }
        }
        try {
            if (this.viewPipeline.middlewares.length && accept && accept.indexOf('text/html') > -1) {
                await this.sendView(context, data, status, ERROR_TEMPLATE);
            } else {
                this.sendJson(context, data.message ?? data.name, status);
            }
        }
        catch (e) {
            if (this.logging >= LogLevel.errors) {
                console.error(e);
            }
        }
    }

    // TODO: Remove data parameter
    log<T>(context: Context, _data: T, status: number = 500) {
        if (this.logging >= LogLevel.verbose) {
            console.log(context.request.method, context.request.url, colorStatus(status));
        }
    }

    use<T, U>(middlware: Middleware<Context, T, U>) {
        this.pipeline.use(middlware);
    }

    useError<T, U>(middlware: Middleware<Context, T, U>) {
        this.errorPipeline.use(middlware);
    }

    useView<T, U>(middlware: Middleware<Context, T, U>) {
        this.viewPipeline.use(middlware);
    }
}

export function errorTemplate(error: any) {
    return (
        `<!DOCTYPE html>
<html>
    <head>
        <title>Sierra Error</title>
    </head>
    <body>
        <h1>Sierra Error</h1>
        <pre><code>${error}</code></pre>
    </body>
</html>`
    );
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