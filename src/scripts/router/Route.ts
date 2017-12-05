import { IMiddleware } from '../server/IMiddleware';
import { Verb } from './Verb';

export default class Route<T, U> {
    verb: Verb;
    name: string | RegExp;
    middlewares: IMiddleware<any, any>[];
    method: IMiddleware<T, U>;

    constructor(
        verb: Verb,
        name: string | RegExp,
        middlewares: IMiddleware<any, any>[],
        method: IMiddleware<T, U>
    ) {
        this.verb = verb;
        this.name = name;
        this.middlewares = middlewares;
        this.method = method;
    }
}