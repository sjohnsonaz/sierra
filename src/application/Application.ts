import { createServer, Server } from 'http';
import { ListenOptions } from 'net';

import { Middleware, MiddlewareContext, MiddlewareReturn } from '@cardboardrobots/pipeline';

import { RequestHandler, LogLevel, Context, ViewContext, ErrorContext } from '../server';

/**
 * A Sierra Application
 */
export class Application<CONTEXT extends Context = Context, RESULT = void> {
    /** The RequestHandler object */
    requestHandler: RequestHandler<CONTEXT, RESULT> = new RequestHandler();

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
        return this.requestHandler;
    }

    /**
     * Adds a Middleware to the Pipeline.
     * @param middleware - the Middleware to add
     */
    use<NEWDATA, NEWRESULT = RESULT>(
        middleware: Middleware<CONTEXT & Context<NEWDATA>, RESULT, NEWRESULT>
    ): Application<CONTEXT & Context<NEWDATA>, NEWRESULT>;

    use<MIDDLEWARE extends Middleware<any, any, any>>(
        middleware: MIDDLEWARE
    ): Application<CONTEXT & MiddlewareContext<MIDDLEWARE>, MiddlewareReturn<MIDDLEWARE>>;

    use(middleware: Middleware<any, any, any>): any {
        this.requestHandler.use(middleware);
        return this as any;
    }

    /**
     * Sets View Middleware.  Only one is enabled at a time.
     * @param middlware - the View Middleware
     */
    useView<NEWRESULT>(middlware: Middleware<ViewContext<CONTEXT, NEWRESULT>, RESULT, NEWRESULT>) {
        this.requestHandler.useView(middlware);
    }

    /**
     * Sets Error Middleware.  Only one is enabled at a time.
     * @param middlware - the Error Middleware
     */
    useError<NEWRESULT>(middlware: Middleware<ErrorContext<CONTEXT>, Error, NEWRESULT>) {
        this.requestHandler.useError(middlware);
    }

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param port - the Port to open
     * @param hostname - the Hostname
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    listen(
        port?: number,
        hostname?: string,
        backlog?: number,
        listeningListener?: () => void
    ): Promise<Server>;

    listen(port?: number, hostname?: string, listeningListener?: () => void): Promise<Server>;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
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
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    listen(options: ListenOptions, listeningListener?: () => void): Promise<Server>;

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param handle - the Handle to open
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    listen(handle: any, backlog?: number, listeningListener?: () => void): Promise<Server>;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    listen(handle: any, listeningListener?: () => void): Promise<Server>;
    listen(paramA: any, paramB?: any, paramC?: any, paramD?: any): Promise<Server> {
        return new Promise((resolve, reject) => {
            const startup = () => {
                this.server.on('error', onError);
                this.server.on('listening', onListening);
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
                cleanup();
            };
            startup();
            this.server.listen(paramA, paramB, paramC, paramD);
        });
    }

    /**
     * Closes the `http.Server`.
     */
    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server.close((error) => {
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
        return new Promise<void>((resolve) => {
            process.on('SIGINT', () => {
                resolve();
            });
            process.on('SIGTERM', () => {
                resolve();
            });
        });
    }
}
