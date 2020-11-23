import { Middleware } from '../../../pipeline';
import { Context, NoMethodError, Verb } from '../../../server';
import { Route } from '../Route';

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

    createRoute(definitionName: string, method: Middleware<Context, any, any>, middleware: Middleware<Context, any, any>[], template: string) {
        return new Route(this.verbs, this.name || definitionName, middleware, method, this.template || template);
    }
}

export class RouteDefinition<U extends Middleware<Context, any, any>> {
    method?: RouteMethod;
    middleware: U[] = [];

    constructor(definitionMethod?: RouteMethod) {
        this.method = definitionMethod;
    }

    createRoute(name: string, method: Middleware<any, any, any>, template: string) {
        if (!this.method) {
            throw new NoMethodError(name);
        }
        return this.method.createRoute(name, method, this.middleware, template);
    }
}
