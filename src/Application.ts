import * as http from 'http';

import { IServerMiddleware } from './server/IServerMiddleware';
import { IViewMiddleware } from './server/IViewMiddleware';

import Controller from './middleware/route/Controller';
import Route from './middleware/route/Route';

import { RequestHandler } from './server/RequestHandler';
import RouteMiddleware from './middleware/route/RouteMiddleware';
import { LogLevel } from './server/LogLevel';
import { NeverStartedError } from './server/Errors';

/**
 * A Sierra Application
 */
export class Application {
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

    /**
     * Initializes Middleware and builds Controllers
     * @returns Promise<void>
     */
    async init() {
        await this.buildControllers();
        return this.requestHandler;
    }

    addController(controller: Controller) {
        this.controllers.push(controller);
    }

    /**
     * Create Routes for all Controllers
     */
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

    /**
     * Add Middleware to the Pipeline.
     * @param middleware - the Middleware to add
     */
    use(middleware: IServerMiddleware<any, any>) {
        this.requestHandler.use(middleware);
    }

    /**
     * Set View Middleware.  Only one is enabled at a time.
     * @param viewMiddlware - the View Middleware
     */
    view(viewMiddlware: IViewMiddleware<any>) {
        this.requestHandler.view = viewMiddlware;
    }

    /**
     * Set Error Middleware.  Only one is enabled at a time.
     * @param errorMiddleware - the Error Middleware
     */
    error(errorMiddleware: IServerMiddleware<any, any>) {
        this.requestHandler.error = errorMiddleware;
    }

    /**
     * Creates the `http.Server`.
     */
    createServer() {
        return http.createServer(this.requestHandler.callback);
    }

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param port - the Port to open
     */
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

    /**
     * Closes the `http.Server`.
     */
    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                reject(new NeverStartedError());
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

    /**
     * Waits for `SIGINT` or `SIGTERM` signals on the `Process` object.
     */
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

/**
 * Compares two Routes for sorting.
 * @param routeA - the first Route
 * @param routeB - the second Route
 */
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
