import { Verb } from './Verb';
import { IServerMiddleware } from '../../server/IServerMiddleware';

export default class Route<T, U> {
    verb: Verb;
    name: string | RegExp;
    regex: RegExp;
    middlewares: IServerMiddleware<any, any>[];
    method: IServerMiddleware<T, U>;
    pipeArgs: boolean;
    argumentNames: string[];
    template: string;

    constructor(
        verb: Verb,
        name: string | RegExp,
        regex: RegExp,
        middlewares: IServerMiddleware<any, any>[],
        method: IServerMiddleware<T, U>,
        pipeArgs: boolean = false,
        argumentNames: string[] = [],
        template: string
    ) {
        this.verb = verb;
        this.name = name;
        this.regex = regex;
        this.middlewares = middlewares;
        this.method = method;
        this.pipeArgs = pipeArgs;
        this.argumentNames = argumentNames;
        this.template = template;
    }
}