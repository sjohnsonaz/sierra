import { RequestListener, ServerOptions } from 'http';

import { RequestHandler } from '../request-handler';

import { PromiseServer } from './PromiseServer';

export function createServer(requestListener?: RequestListener): PromiseServer;
export function createServer(handler: RequestHandler<any, any>): PromiseServer;
export function createServer(
    options: ServerOptions,
    requestListener?: RequestListener
): PromiseServer;
export function createServer(...args: any): PromiseServer {
    if (args[0] instanceof RequestHandler) {
        return new PromiseServer(args[0].callback);
    } else {
        return new PromiseServer(...args);
    }
}
