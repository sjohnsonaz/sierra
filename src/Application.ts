import { createServer, Server } from 'http';
import { ListenOptions } from 'net';

import {
    RequestHandler,
    LogLevel,
    Context
} from './server';
import { Controller, RouteMiddleware } from './middleware/route';
import { Middleware } from './pipeline';

/**
 * A Sierra Application
 */
export class Application {
    /** The RequestHandler object */
    requestHandler: RequestHandler = new RequestHandler();

    /** The RouteMiddleware object */
    routeMiddleware: RouteMiddleware = new RouteMiddleware();

    controllers: Controller[] = [];

    /** The Server object */
    server: Server = createServer(this.requestHandler.callback);

    /** The logging level */
    get logging() {
        return this.requestHandler.logging;
    }

    /** The logging level */
    set logging(logging: LogLevel) {
        this.requestHandler.logging = logging;
    }

    /**
     * Initializes Middleware and builds Controllers
     * @returns Promise<void>
     */
    async init() {
        for (let controller of this.controllers) {
            const routeGroup = Controller.build(controller);
            this.routeMiddleware.addGroup(routeGroup);
        }
        const routes = this.routeMiddleware.init();

        // Add RouteMiddleware if we have Routes.
        if (routes.length) {
            this.requestHandler.use(this.routeMiddleware.handle);
        }
        return this.requestHandler;
    }

    /**
     * Adds a Controller to RouteMiddleware
     * @param controller - the Controller to add
     */
    addController(controller: Controller) {
        this.controllers.push(controller);
    }

    /**
     * Removes a Controller from RouteMiddleware
     * @param controller - the Controller to remove
     */
    removeController(controller: Controller) {
        const index = this.controllers.indexOf(controller);
        if (index >= 0) {
            return !!this.controllers.splice(index).length;
        } else {
            return false;
        }
    }

    /**
     * Adds a Middleware to the Pipeline.
     * @param middleware - the Middleware to add
     */
    use(middleware: Middleware<Context, any, any>) {
        this.requestHandler.use(middleware);
    }

    /**
     * Sets View Middleware.  Only one is enabled at a time.
     * @param viewMiddlware - the View Middleware
     */
    view(viewMiddlware: Middleware<Context, any, any>) {
        this.requestHandler.useView(viewMiddlware);
    }

    /**
     * Sets Error Middleware.  Only one is enabled at a time.
     * @param errorMiddleware - the Error Middleware
     */
    error(errorMiddleware: Middleware<Context, any, any>) {
        this.requestHandler.useError(errorMiddleware);
    }

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param port - the Port to open
     * @param hostname - the Hostname
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Promise<Server>;
    listen(port?: number, hostname?: string, listeningListener?: () => void): Promise<Server>;
    listen(port?: number, backlog?: number, listeningListener?: () => void): Promise<Server>;
    listen(port?: number, listeningListener?: () => void): Promise<Server>;

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param path - the Path to open
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    listen(path: string, backlog?: number, listeningListener?: () => void): Promise<Server>;
    listen(path: string, listeningListener?: () => void): Promise<Server>;

    /**
 * Opens the `http.Server` to listen on the specified Port.
 * @param options - a options object
 * @param listeningListener - a callback for the "listening" event
 */
    listen(options: ListenOptions, listeningListener?: () => void): Promise<Server>;

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param handle - the Handle to open
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    listen(handle: any, backlog?: number, listeningListener?: () => void): Promise<Server>;
    listen(handle: any, listeningListener?: () => void): Promise<Server>;
    listen(a: any, b?: any, c?: any, d?: any): Promise<Server> {
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
            this.server.listen(a, b, c, d);
        });
    }

    /**
     * Closes the `http.Server`.
     */
    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
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
