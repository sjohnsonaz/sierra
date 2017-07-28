import { Verb } from './Verb';
import { IMiddleware } from './IMiddleware';

export interface IServerIntegration<T, U extends IMiddleware> {
    (
        app: T,
        verb: Verb,
        name: string | RegExp,
        middleware: U[],
        method: () => any
    ): any;
}