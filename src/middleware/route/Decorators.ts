import { IMethod, IServerMiddleware, Verb, VerbType } from '../../server';
import { Controller } from './Controller';
import { RouteBuilder } from './RouteBuilder';

/**
 * Adds a method as a route.  By default arguments are not piped from the request.
 * @param verb 
 * @param name 
 */
export function route<U extends IServerMiddleware<any, any>>(verb: Verb | Verb[] = VerbType.Get, name?: string | RegExp, pipeArgs: boolean = false) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (verb instanceof Array) {
            verb.forEach(verb => {
                // TODO: Change to propertyKey
                routeBuilder.addDefinition(propertyKey, verb, name as any, pipeArgs);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, verb, name as any, pipeArgs);
        }
    }
}

/**
 * Adds a method as a route.
 * @param verb 
 * @param name 
 */
export function method<U extends IMethod<any>>(verb: Verb | Verb[] = VerbType.Get, name?: string | RegExp) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (verb instanceof Array) {
            verb.forEach(verb => {
                // TODO: Change to propertyKey
                routeBuilder.addDefinition(propertyKey, verb, name as any, true);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, verb, name as any, true);
        }
    }
}

/**
 * Adds a function to the middleware queue.  Middleware functions will be called in the order declared.
 * @param verb 
 * @param name 
 */
export function middleware<T extends IServerMiddleware<any, any>, U extends IMethod<any> | IMethod<any>>(middleware: T) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        // Decorators are applied in reverse order, so we must add to the beginning of the Array.
        routeBuilder.unshiftMiddleware(propertyKey, middleware);
    }
}