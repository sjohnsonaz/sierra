import { Middleware } from '../../pipeline';
import { Context, IMethod, Verb } from '../../server';
import { Controller } from './Controller';
import { RouteBuilder } from './RouteBuilder';

type VerbType = Verb | Verb[keyof Verb];

/**
 * Adds a method as a route.  By default arguments are not piped from the request.
 * @param verb 
 * @param name 
 */
export function route<U extends Middleware<Context, any, any>>(verb: VerbType | VerbType[] = Verb.Get, name?: string | RegExp, pipeArgs: boolean = false) {
    const _verb: Verb | Verb[] = verb as any;
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (_verb instanceof Array) {
            _verb.forEach(verb => {
                // TODO: Change to propertyKey
                routeBuilder.addDefinition(propertyKey, verb, name as any, pipeArgs);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, _verb, name as any, pipeArgs);
        }
    }
}

/**
 * Adds a method as a route.
 * @param verb 
 * @param name 
 */
export function method<U extends IMethod<any>>(verb: VerbType | VerbType[] = Verb.Get, name?: string | RegExp) {
    const _verb: Verb | Verb[] = verb as any;
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (_verb instanceof Array) {
            _verb.forEach(verb => {
                // TODO: Change to propertyKey
                routeBuilder.addDefinition(propertyKey, verb, name as any, true);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, _verb, name as any, true);
        }
    }
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