import { IMiddleware } from '../server/IMiddleware';
import { Verb } from './Verb';

export default class Route<T, U> {
    verb: Verb;
    name: string | RegExp;
    middlewares: IMiddleware<any, any>[];
    method: IMiddleware<T, U>;
    pipeArgs: boolean;
    argumentNames: string[];
    template: string;

    constructor(
        verb: Verb,
        name: string | RegExp,
        middlewares: IMiddleware<any, any>[],
        method: IMiddleware<T, U>,
        pipeArgs: boolean = false,
        argumentNames: string[] = [],
        template: string
    ) {
        this.verb = verb;
        this.name = name;
        this.middlewares = middlewares;
        this.method = method;
        this.pipeArgs = pipeArgs;
        this.argumentNames = argumentNames;
        this.template = template;
    }
}