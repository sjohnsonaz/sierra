import { VerbType } from '../router/Verb';
import { IMiddleware } from '../server/IMiddleware';

import RouteBuilder from '../router/RouteBuilder';
import Controller from '../router/Controller';

export function route<U extends IMiddleware<any, any>>(verb?: VerbType, name?: string | RegExp, pipeArgs: boolean = false) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addDefinition(propertyKey, verb as any, name, pipeArgs);
    }
}

export function method<U extends Function>(verb?: VerbType, name?: string | RegExp) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addDefinition(propertyKey, verb as any, name, true);
    }
}

export function middleware<T extends IMiddleware<any, any>, U extends IMiddleware<any, any>>(middleware: T) {
    return function (target: Controller, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addMiddleware(propertyKey, middleware);
    }
}
