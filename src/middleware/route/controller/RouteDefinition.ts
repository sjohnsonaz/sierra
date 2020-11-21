import { Middleware } from '../../../pipeline';
import { Context, Verb } from '../../../server';

export class RouteMethod {
    verbs: Verb[];
    name: string | RegExp;
    template?: string;

    constructor(
        verbs: Verb[],
        name: string | RegExp,
        template?: string,
    ) {
        this.verbs = verbs;
        this.name = name;
        this.template = template;
    }
}

export class RouteDefinition<U extends Middleware<Context, any, any>> {
    method?: RouteMethod;
    middleware: U[] = [];

    constructor(definitionMethod?: RouteMethod) {
        this.method = definitionMethod;
    }
}
