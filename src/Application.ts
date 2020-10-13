import * as http from 'http';

import { IServerMiddleware } from './server/IServerMiddleware';
import { IViewMiddleware } from './server/IViewMiddleware';

import { RequestHandler } from './server/RequestHandler';
import RouteMiddleware from './middleware/route/RouteMiddleware';
import Controller from './middleware/route/Controller';
import { LogLevel } from './server/LogLevel';
import { NeverStartedError } from './server/Errors';

/**
 * A Sierra Application
 */
export class Application {
    requestHandler: RequestHandler = new RequestHandler();
    routeMiddleware: RouteMiddleware = new RouteMiddleware();
    server: http.Server;

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
        await this.routeMiddleware.init();

        // Add RouteMiddleware if we have Routes.
        if (this.routeMiddleware.routes.length) {
            this.requestHandler.use(this.routeMiddleware.handler);
        }
        return this.requestHandler;
    }

    /**
     * Adds a Controller to RouteMiddleware
     * @param controller - the Controller to add
     */
    addController(controller: Controller) {
        this.routeMiddleware.addController(controller);
    }

    /**
     * Removes a Controller from RouteMiddleware
     * @param controller - the Controller to remove
     */
    removeController(controller: Controller) {
        this.routeMiddleware.removeController(controller);
    }

    /**
     * Adds a Middleware to the Pipeline.
     * @param middleware - the Middleware to add
     */
    use(middleware: IServerMiddleware<any, any>) {
        this.requestHandler.use(middleware);
    }

    /**
     * Sets View Middleware.  Only one is enabled at a time.
     * @param viewMiddlware - the View Middleware
     */
    view(viewMiddlware: IViewMiddleware<any>) {
        this.requestHandler.view = viewMiddlware;
    }

    /**
     * Sets Error Middleware.  Only one is enabled at a time.
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
