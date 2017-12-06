import * as http from 'http';

import { IMiddleware } from './IMiddleware';
import { IViewMiddleware } from './IViewMiddleware';
import Context from './Context';
import OutgoingMessage from './OutgoingMessage';

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
                    this.send(context, result.data, result.status, result.template, result.json);
                    break;
                }
            }
            if (!(result instanceof OutgoingMessage)) {
                this.send(context, result);
            }
        }
        catch (e) {
            let errorStatus = 500;
            if (e === 'No route found') {
                errorStatus = 404;
            }
            if (this.error) {
                try {
                    let result = await this.error(context, e);
                    if (result instanceof OutgoingMessage) {
                        this.send(context, result.data, result.status, result.template, result.json);
                    } else {
                        this.send(context, result, errorStatus, 'error');
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

    sendJson(context: Context, data: any, status: number = 200) {
        context.response.statusCode = status;
        context.response.setHeader('Content-Type', 'application/json');
        context.response.write(JSON.stringify(data || null));
        context.response.end();
    }

    async sendView(context: Context, data: any, status: number = 200, template: string) {
        try {
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

    send<T>(context: Context, data: any, status: number = 200, template?: string, json?: boolean) {
        console.log(context.request.method, context.request.url, colorStatus(status));
        let accept = context.request.headers.accept;
        if (this.view && !json && accept && accept.indexOf('text/html') > -1) {
            this.sendView(context, data, status, template);
        } else {
            this.sendJson(context, data, status);
        }
    }

    sendError<T>(context: Context, data: Error, status: number = 500) {
        console.log(context.request.method, context.request.url, colorStatus(status));
        let accept = context.request.headers.accept;
        if (!(data instanceof Error)) {
            data = new Error(data);
        }
        if (Math.floor(status / 100) === 5) {
            console.error(data);
        }
        if (this.view && accept && accept.indexOf('text/html') > -1) {
            this.sendView(context, data, status, 'error');
        } else {
            this.sendJson(context, data, status);
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