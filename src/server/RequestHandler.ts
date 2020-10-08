import * as http from 'http';

import { Color } from '../utils/ConsoleUtil';
import Pipeline from '../pipeline/Pipeline';

import { IServerMiddleware } from './IServerMiddleware';
import { IViewMiddleware } from './IViewMiddleware';
import Context from './Context';
import OutgoingMessage, { OutputType } from './OutgoingMessage';
import { LogLevel } from './LogLevel';
import { ErrorMessage, NoViewMiddlwareError, NoViewTemplateError, SierraError } from './Errors';

export class RequestHandler {
    pipeline: Pipeline<Context, any, any> = new Pipeline();
    error: IServerMiddleware<any, any>;
    view: IViewMiddleware<any>;
    logging: LogLevel = LogLevel.errors;

    callback = async (request: http.IncomingMessage, response: http.ServerResponse) => {
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
            if (this.error) {
                try {
                    let result = await this.error(context, e);
                    if (result instanceof OutgoingMessage) {
                        this.send(context, result.data, result.status, result.type, result.template, result.contentType);
                    } else {
                        this.send(context, result, errorStatus, 'auto', 'error');
                    }
                }
                catch (e) {
                    this.sendError(context, e, errorStatus);
                }
            } else {
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

    sendRaw<T>(context: Context, data: T, status: number = 200, contentType: string) {
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

    async sendView<T>(context: Context, data: T, status: number = 200, template: string) {
        try {
            if (!this.view) {
                throw new NoViewMiddlwareError();
            }
            let output = await this.view(context, data, template ?? context.template);
            this.log(context, data, status);
            context.response.statusCode = status;
            context.response.setHeader('Content-Type', 'text/html');
            context.response.write(output);
            context.response.end();
        }
        catch (e) {
            if (e instanceof NoViewTemplateError) {
                this.sendJson(context, data, status);
            } else {
                this.log(context, data, 500);
                context.response.statusCode = 500;
                context.response.setHeader('Content-Type', 'text/html');
                context.response.write(errorTemplate(e));
                context.response.end();
            }
            if (this.logging >= LogLevel.errors) {
                console.error(e);
            }
        }
    }

    send<T>(context: Context, data: T, status: number = 200, type: OutputType = 'auto', template?: string, contentType?: string) {
        let accept = context.accept;
        switch (type) {
            case 'auto':
                if (this.view && accept.indexOf('text/html') > -1) {
                    this.sendView(context, data, status, template);
                } else if (accept.indexOf('application/json')) {
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
        let accept = context.request.headers.accept;
        if (!(data instanceof Error)) {
            data = new Error(data);
        }
        if (Math.floor(status / 100) === 5) {
            if (this.logging >= LogLevel.errors) {
                console.error(data);
            }
        }
        try {
            if (this.view && accept && accept.indexOf('text/html') > -1) {
                await this.sendView(context, data, status, 'error');
            } else {
                await this.sendJson(context, data.message ?? data.name, status);
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

    use<T, U>(middlware: IServerMiddleware<T, U>) {
        this.pipeline.use(middlware);
    }
}

function errorTemplate(error: any) {
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

function colorStatus(status: number) {
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