import * as http from 'http';

import { IMiddleware } from './IMiddleware';
import Context from './Context';
import OutgoingMessage from './OutgoingMessage';

import ConsoleUtil from '../utils/ConsoleUtil';

export default class RequestHandler {
    middlewares: IMiddleware<any, any>[] = [];
    error: IMiddleware<any, any>;
    view: IMiddleware<any, string>;

    callback = async (request: http.IncomingMessage, response: http.ServerResponse) => {
        let context = new Context(request, response);
        try {
            let result = undefined;
            for (let index = 0, length = this.middlewares.length; index < length; index++) {
                result = await this.middlewares[index](context, result);
                if (result instanceof OutgoingMessage) {
                    this.send(context, result.data, result.status);
                    break;
                }
            }
            if (!(result instanceof OutgoingMessage)) {
                this.send(context, result);
            }
        }
        catch (e) {
            if (this.error) {
                try {
                    let result = await this.error(context, e);
                    if (result instanceof OutgoingMessage) {
                        this.send(context, result.data, result.status);
                    } else {
                        this.send(context, e, 500);
                    }
                }
                catch (e) {
                    this.send(context, e, 500);
                }
            } else {
                this.send(context, e, 500);
            }
        }
    };

    sendJson(context: Context, data: any, status: number = 200) {
        context.response.statusCode = status;
        context.response.setHeader('Content-Type', 'application/json');
        context.response.write(JSON.stringify(data));
        context.response.end();
    }

    async sendView(context: Context, data: any, status: number = 200) {
        context.response.statusCode = status;
        context.response.setHeader('Content-Type', 'text/html');
        context.response.write(await this.view(context, data));
        context.response.end();
    }

    send<T>(context: Context, data: any, status: number = 200) {
        console.log(context.request.method, context.request.url, colorStatus(status));
        let accept = context.request.headers.accept;
        if (this.view && accept && accept.indexOf('text/html') > -1) {
            this.sendView(context, data, status);
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