import { Server } from 'http';
import { ListenOptions } from 'net';

import { Handler } from '../handler';

export class PromiseServer<HANDLER extends Handler<any, any>> extends Server {
    handler: HANDLER;

    constructor(handler: HANDLER) {
        super(handler.callback);
        this.handler = handler;
    }

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param port - the Port to open
     * @param hostname - the Hostname
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    start(
        port?: number,
        hostname?: string,
        backlog?: number,
        listeningListener?: () => void
    ): Promise<Server>;

    start(port?: number, hostname?: string, listeningListener?: () => void): Promise<Server>;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    start(port?: number, backlog?: number, listeningListener?: () => void): Promise<Server>;
    start(port?: number, listeningListener?: () => void): Promise<Server>;

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param path - the Path to open
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    start(path: string, backlog?: number, listeningListener?: () => void): Promise<Server>;
    start(path: string, listeningListener?: () => void): Promise<Server>;

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param options - a options object
     * @param listeningListener - a callback for the "listening" event
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    start(options: ListenOptions, listeningListener?: () => void): Promise<Server>;

    /**
     * Opens the `http.Server` to listen on the specified Port.
     * @param handle - the Handle to open
     * @param backlog - the Backlog number
     * @param listeningListener - a callback for the "listening" event
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    start(handle: any, backlog?: number, listeningListener?: () => void): Promise<Server>;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    start(handle: any, listeningListener?: () => void): Promise<Server>;
    start(paramA: any, paramB?: any, paramC?: any, paramD?: any): Promise<Server> {
        return new Promise((resolve, reject) => {
            const startup = () => {
                this.on('error', onError);
                this.on('listening', onListening);
            };
            const cleanup = () => {
                this.off('error', onError);
                this.off('listening', onListening);
            };
            const onError = (err: Error) => {
                reject(err);
                cleanup();
            };
            const onListening = () => {
                resolve(this);
                cleanup();
            };
            startup();
            this.listen(paramA, paramB, paramC, paramD);
        });
    }

    /**
     * Closes the `http.Server`.
     */
    exit(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.close((error) => {
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
