import * as http from 'http';

import { IServerMiddleware } from './server/IServerMiddleware';
import { IViewMiddleware } from './server/IViewMiddleware';

import Controller from './middleware/route/Controller';
import Route from './middleware/route/Route';

import RequestHandler from './server/RequestHandler';
import RouteMiddleware from './middleware/route/RouteMiddleware';
import { Errors } from './server/Errors';
import { LogLevel } from './server/LogLevel';

export default class Application {
    requestHandler: RequestHandler = new RequestHandler();
    routeMiddleware: RouteMiddleware = new RouteMiddleware();
    server: http.Server;
    controllers: Controller[] = [];

    get logging() {
        return this.requestHandler.logging;
    }

    set logging(logging: LogLevel) {
        this.requestHandler.logging = logging;
    }

    async init() {
        await this.connectDatabase();
        await this.addMiddleware(this.requestHandler);
        await this.buildControllers();
        return this.requestHandler;
    }

    connectDatabase(): Promise<void> {
        return Promise.resolve();
    }

    addMiddleware(requestHandler: RequestHandler): Promise<void> {
        return Promise.resolve();
    }

    addController(controller: Controller) {
        this.controllers.push(controller);
    }

    async buildControllers() {
        this.controllers.forEach(controller => {
            Controller.build(controller).forEach(route => {
                this.routeMiddleware.routes.push(route);
            });
        });

        // Sort Routes

        // Separate string Routes
        let regexRoutes: Route<any, any>[] = [];
        let stringRoutes: Route<any, any>[] = [];
        this.routeMiddleware.routes.forEach(route => {
            if (route.name instanceof RegExp) {
                regexRoutes.push(route);
            } else {
                stringRoutes.push(route);
            }
        });

        // Sort string Routes
        stringRoutes.sort(sortRoutes);

        // Concat all Routes
        this.routeMiddleware.routes = regexRoutes.concat(stringRoutes);

        // Add RouteMiddleware if we have Routes.
        if (this.routeMiddleware.routes.length) {
            this.requestHandler.use(this.routeMiddleware.handler);
        }
    }

    use(middleware: IServerMiddleware<any, any>) {
        this.requestHandler.use(middleware);
    }

    view(viewMiddlware: IViewMiddleware<any>) {
        this.requestHandler.view = viewMiddlware;
    }

    error(errorMiddleware: IServerMiddleware<any, any>) {
        this.requestHandler.error = errorMiddleware;
    }

    createServer() {
        return http.createServer(this.requestHandler.callback);
    }

    listen(port: number): Promise<http.Server> {
        if (!this.server) {
            this.server = this.createServer();
        }
        return new Promise((resolve, reject) => {
            const startup = () => {
                this.server.on('error', onError);
                this.server.on('listening', onListening)
            };
            const cleanup = () => {
                this.server.off('error', onError);
                this.server.off('listening', onListening);
            };
            const onError = (err: Error) => {
                reject(err);
                cleanup();
            };
            const onListening = () => {
                resolve(this.server);
                cleanup()
            };
            startup();
            this.server.listen(port);
        });
    }

    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                reject(Errors.neverStarted);
            } else {
                this.server.close(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
        });
    }

    async wait() {
        return new Promise<void>(resolve => {
            process.on('SIGINT', () => {
                resolve();
            });
            process.on('SIGTERM', () => {
                resolve();
            });
        });
    }
}

export function sortRoutes(routeA: Route<any, any>, routeB: Route<any, any>) {
    let a = routeA.name as string;
    let b = routeB.name as string;
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
}
