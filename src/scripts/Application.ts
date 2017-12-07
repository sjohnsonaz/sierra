import * as http from 'http';

import { IMiddleware } from './server/IMiddleware';
import { IViewMiddleware } from './server/IViewMiddleware';

import Controller from './router/Controller';

import RequestHandler from './server/RequestHandler';
import RouteMiddleware from './middleware/RouteMiddleware';
import { error } from 'util';

export default class Application {
    requestHandler: RequestHandler = new RequestHandler();
    routeMiddleware: RouteMiddleware = new RouteMiddleware();
    server: http.Server;
    controllers: Controller[] = [];

    addController(controller: Controller) {
        this.controllers.push(controller);
    }

    init() {
        this.server = this.createServer();
        this.connectDatabase();
        this.addMiddleware(this.requestHandler);
        this.buildControllers();
    }

    buildControllers() {
        console.log('Building Controllers: ' + this.controllers.length);

        this.controllers.forEach(controller => {
            controller.build().forEach(route => {
                this.routeMiddleware.routes.push(route);
            });
        });

        // Sort routes
        this.routeMiddleware.routes.sort((routeA, routeB) => {
            let a = (routeA.name instanceof RegExp) ? '' : routeA.name;
            let b = (routeB.name instanceof RegExp) ? '' : routeB.name;
            let aParts = a.substr(1).split('/');
            let bParts = b.substr(1).split('/');
            let length = Math.max(aParts.length, bParts.length);
            let result = 0;
            for (let index = 0; index < length; index++) {
                let aPart = aParts[index] || '';
                let bPart = bParts[index] || '';
                result = ((aPart[0] === ':') as any) - ((bPart[0] === ':') as any);
                if (result) {
                    break;
                }
            }
            return result;
        });

        console.log('Routes: ' + this.routeMiddleware.routes.length);

        this.requestHandler.use(this.routeMiddleware.handler);
    }

    connectDatabase(): Promise<boolean> {
        return Promise.resolve(true);
    }

    addMiddleware(requestHandler: RequestHandler): void {

    }

    use(middleware: IMiddleware<any, any>) {
        this.requestHandler.use(middleware);
    }

    view(viewMiddlware: IViewMiddleware<any>) {
        this.requestHandler.view = viewMiddlware;
    }

    error(errorMiddleware: IMiddleware<any, any>) {
        this.requestHandler.error = errorMiddleware;
    }

    createServer() {
        return http.createServer(this.requestHandler.callback);
    }

    listen(port: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.server.listen(port, () => {
                    resolve(true);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    close(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                this.server.close(() => {
                    resolve(true);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
}