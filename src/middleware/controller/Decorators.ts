import { Middleware } from '../../pipeline';
import { Context, Verb } from '../../server';
import { Controller } from './Controller';
import { IMethod } from './IMethod';
import { RouteBuilder } from './RouteBuilder';

type VerbString = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
type VerbType = Verb | VerbString;

/**
 * Adds a method as a route.
 * @param verb 
 * @param name 
 */
export function method<U extends IMethod<any>>(verbs: VerbType | VerbType[] = Verb.Get, name?: string | RegExp, template?: string) {
    const _verbs: Verb[] = verbs instanceof Array ? verbs as any : [verbs];
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        let key = name || propertyKey;
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addRoute(propertyKey, _verbs, key, template);
    };
}

/**
 * Adds a function to the middleware queue.  Middleware functions will be called in the order declared.
 * @param verb 
 * @param name 
 */
export function middleware<T extends Middleware<Context, any, any>, U extends IMethod<any> | IMethod<any>>(middleware: T) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        // Decorators are applied in reverse order, so we must add to the beginning of the Array.
        routeBuilder.unshiftMiddleware(propertyKey, middleware);
    }
}
