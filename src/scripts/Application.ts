import * as http from 'http';

import { IMiddleware } from './server/IMiddleware';

import Controller from './router/Controller';

import RequestHandler from './server/RequestHandler';
import RouteMiddleware from './router/RouteMiddleware';

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
        this.addMiddleware();
        this.buildControllers();
    }

    buildControllers() {
        console.log('Building Controllers: ' + this.controllers.length);

        this.controllers.forEach(controller => {
            controller.build().forEach(route => {
                this.routeMiddleware.routes.push(route);
            });
        });

        console.log('Routes: ' + this.routeMiddleware.routes.length);

        this.requestHandler.use(this.routeMiddleware.handler);
    }

    connectDatabase(): Promise<boolean> {
        return Promise.resolve(true);
    }

    addMiddleware(): void {

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