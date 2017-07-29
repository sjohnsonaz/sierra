import * as http from 'http';
import * as https from 'https';

export interface IMiddleware<T, U> {
    (context: IContext, value: T): Promise<U>;
}

export interface IContext {
    app: Server,
    req: http.IncomingMessage;
    res: http.ServerResponse;
}

export default class Server {
    middlewares: IMiddleware<any, any>[] = [];

    constructor() {

    }

    use(middleware: IMiddleware<any, any>) {
        this.middlewares.push(middleware);
    }

    route(prefix: string, middleware: IMiddleware<any, any>) {
        this.middlewares.push(middleware);
    }

    async callback(req: http.IncomingMessage, res: http.ServerResponse) {
        let context: IContext = {
            app: this,
            req: req,
            res: res
        };
        let value = undefined;
        for (var index = 0, length = this.middlewares.length; index < length; index++) {
            let middleware = this.middlewares[index];
            value = await middleware(context, value);
        }
    }

    listen(port: number) {
        let server = http.createServer(this.callback.bind(this));
        server.listen(port);
        return server
    }

    listenSecure(port: number) {
        let server = https.createServer(this.callback.bind(this));
        server.listen(port);
        return server
    }
}

let server = new Server();
server.use(async (context) => {
    return true;
})