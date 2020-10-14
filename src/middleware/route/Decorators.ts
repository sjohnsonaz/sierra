import { IMethod, IServerMiddleware, Verb } from '../../server';
import { Controller } from './Controller';
import { RouteBuilder } from './RouteBuilder';

/**
 * Adds a method as a route.  By default arguments are not piped from the request.
 * @param verb 
 * @param name 
 */
export function route<U extends IServerMiddleware<any, any>>(verb?: Verb | Verb[], name?: string | RegExp, pipeArgs: boolean = false) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (verb instanceof Array) {
            verb.forEach(verb => {
                routeBuilder.addDefinition(propertyKey, verb, name, pipeArgs);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, verb, name, pipeArgs);
        }
    }
}

/**
 * Adds a method as a route.
 * @param verb 
 * @param name 
 */
export function method<U extends IMethod<any>>(verb?: Verb | Verb[], name?: string | RegExp) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (verb instanceof Array) {
            verb.forEach(verb => {
                routeBuilder.addDefinition(propertyKey, verb, name, true);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, verb, name, true);
        }
    }
}

/**
 * Adds a function to the middleware queue.  Middleware functions will be called in the order declared.
 * @param verb 
 * @param name 
 */
export function middleware<T extends IServerMiddleware<any, any>, U extends IServerMiddleware<any, any> | IMethod<any>>(middleware: T) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        const routeBuilder = RouteBuilder.getRouteBuilder(target);
        // Decorators are applied in reverse order, so we must add to the beginning of the Array.
        routeBuilder.unshiftMiddleware(propertyKey, middleware);
    }
}