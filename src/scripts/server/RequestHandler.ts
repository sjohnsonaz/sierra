import * as http from 'http';

import { IMiddleware } from './IMiddleware';
import { IViewMiddleware } from './IViewMiddleware';
import Context from './Context';
import OutgoingMessage, { OutputType } from './OutgoingMessage';
import { Errors } from './Errors';

import ConsoleUtil from '../utils/ConsoleUtil';

export default class RequestHandler {
    middlewares: IMiddleware<any, any>[] = [];
    error: IMiddleware<any, any>;
    view: IViewMiddleware<any>;

    callback = async (request: http.IncomingMessage, response: http.ServerResponse) => {
        let context = new Context(request, response);
        try {
            let result = undefined;
            for (let index = 0, length = this.middlewares.length; index < length; index++) {
                result = await this.middlewares[index](context, result);
                if (result instanceof OutgoingMessage) {
                    this.send(context, result.data, result.status, result.type, result.template, result.contentType);
                    break;
                }
            }
            if (!(result instanceof OutgoingMessage)) {
                this.send(context, result);
            }
            if (result === undefined) {
                throw Errors.notFound;
            }
        }
        catch (e) {
            let errorStatus = 500;
            switch (e) {
                case Errors.noRouteFound:
                case Errors.notFound:
                    errorStatus = 404;
                    break;
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
        context.response.statusCode = status;
        context.response.setHeader('Content-Type', 'application/json');
        context.response.write(JSON.stringify(data || null));
        context.response.end();
    }

    sendRaw<T>(context: Context, data: T, status: number = 200, contentType: string) {
        context.response.statusCode = status;
        if (typeof data === 'string') {
            context.response.setHeader('Content-Type', contentType || 'text/plain');
            context.response.write(data);
        } else if (Buffer.isBuffer(data)) {
            context.response.setHeader('Content-Type', contentType || 'octet-stream');
            context.response.write(data);
        } else {
            context.response.setHeader('Content-Type', contentType || 'application/json');
            context.response.write(JSON.stringify(data || null));
        }
        context.response.end();
    }

    async sendView<T>(context: Context, data: T, status: number = 200, template: string) {
        try {
            if (!this.view) {
                throw 'No view middleware';
            }
            let output = await this.view(context, data, template || context.template);
            context.response.statusCode = status;
            context.response.setHeader('Content-Type', 'text/html');
            context.response.write(output);
            context.response.end();
        }
        catch (e) {
            console.error(e);
            context.response.statusCode = 500;
            context.response.setHeader('Content-Type', 'text/html');
            context.response.write('\
                <!DOCTYPE html>\
                <html>\
                <head>\
                <title>Sierra Error</title>\
                </head>\
                <body>\
                <h1>Sierra Error</h1>\
                <pre><code>' + e + '</code></pre>\
                </body>\
                </html>\
            ');
            context.response.end();
        }
    }

    send<T>(context: Context, data: T, status: number = 200, type: OutputType = 'auto', template?: string, contentType?: string) {
        console.log(context.request.method, context.request.url, colorStatus(status));
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
        console.log(context.request.method, context.request.url, colorStatus(status));
        let accept = context.request.headers.accept;
        if (!(data instanceof Error)) {
            data = new Error(data);
        }
        if (Math.floor(status / 100) === 5) {
            console.error(data);
        }
        try {
            if (this.view && accept && accept.indexOf('text/html') > -1) {
                await this.sendView(context, data, status, 'error');
            } else {
                await this.sendJson(context, data.message || data.name, status);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    use<T, U>(middlware: IMiddleware<T, U>) {
        this.middlewares.push(middlware);
    }
}

function colorStatus(status: number) {
    switch (Math.floor(status / 100)) {
        case 1:
            return ConsoleUtil.white(status);
        case 2:
            return ConsoleUtil.green(status);
        case 3:
            return ConsoleUtil.blue(status);
        case 4:
            return ConsoleUtil.yellow(status);
        case 5:
            return ConsoleUtil.red(status);
        default:
            return ConsoleUtil.gray(status);
    }
}