import { Middleware } from '../../pipeline';
import { Context, Verb } from '../../server';

export class Route<T, U> {
    verb: Verb;
    name: string | RegExp;
    regex: RegExp;
    middlewares: Middleware<Context, any, any>[];
    method: Middleware<Context, T, U>;
    pipeArgs: boolean;
    argumentNames: string[];
    template: string;
    argumentTypes: any[];

    constructor(
        verb: Verb,
        name: string | RegExp,
        regex: RegExp,
        middlewares: Middleware<Context, any, any>[],
        method: Middleware<Context, T, U>,
        pipeArgs: boolean = false,
        argumentNames: string[] = [],
        template: string,
        argumentTypes: any[] = []
    ) {
        this.verb = verb;
        this.name = name;
        this.regex = regex;
        this.middlewares = middlewares;
        this.method = method;
        this.pipeArgs = pipeArgs;
        this.argumentNames = argumentNames;
        this.template = template;
        this.argumentTypes = argumentTypes;
    }
}