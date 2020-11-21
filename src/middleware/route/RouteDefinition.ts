import { Middleware } from '../../pipeline';
import { Context, Verb } from '../../server';

export class RouteMethod {
    verb: Verb;
    name?: string | RegExp;
    pipeArgs: boolean;
    override: boolean;

    constructor(verb: Verb, name?: string | RegExp, pipeArgs: boolean = false, override: boolean = false) {
        this.verb = verb;
        this.name = name;
        this.pipeArgs = pipeArgs;
        this.override = override;
    }
}

export class RouteDefinition<U extends Middleware<Context, any, any>> {
    method?: RouteMethod;
    middleware: U[] = [];

    constructor(method?: RouteMethod) {
        this.method = method;
    }
}
