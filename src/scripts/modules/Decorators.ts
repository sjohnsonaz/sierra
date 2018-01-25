import { VerbType } from '../router/Verb';
import { IMiddleware } from '../server/IMiddleware';
import { IMethod } from '../server/IMethod';

import RouteBuilder from '../router/RouteBuilder';
import Controller from '../router/Controller';

export function route<U extends IMiddleware<any, any>>(verb?: VerbType | VerbType[], name?: string | RegExp, pipeArgs: boolean = false) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (verb instanceof Array) {
            verb.forEach(verb => {
                routeBuilder.addDefinition(propertyKey, verb as any, name, pipeArgs);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, verb as any, name, pipeArgs);
        }
    }
}

export function method<U extends IMethod<any>>(verb?: VerbType | VerbType[], name?: string | RegExp, override: boolean = false) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        if (verb instanceof Array) {
            verb.forEach(verb => {
                routeBuilder.addDefinition(propertyKey, verb as any, name, true);
            });
        } else {
            routeBuilder.addDefinition(propertyKey, verb as any, name, true);
        }
    }
}

export function middleware<T extends IMiddleware<any, any>, U extends IMiddleware<any, any> | IMethod<any>>(middleware: T) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addMiddleware(propertyKey, middleware);
    }
}
