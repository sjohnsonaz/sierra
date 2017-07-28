import * as express from 'express';

import { VerbType } from '../interfaces/Verb';
import { IMiddleware } from '../interfaces/IMiddleware';

import RouteBuilder from '../implementations/RouteBuilder';
import Controller from '../implementations/Controller';

export function route<T, U extends IMiddleware>(verb?: VerbType, name?: string | RegExp, pipeArgs: boolean = false) {
    return function (target: Controller<T, U>, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addDefinition(propertyKey, verb as any, name, pipeArgs);
    }
}

export function middleware<T, U extends IMiddleware>(middleware: U) {
    return function (target: Controller<T, U>, propertyKey: string, descriptor: TypedPropertyDescriptor<U>) {
        var routeBuilder = RouteBuilder.getRouteBuilder(target);
        routeBuilder.addMiddleware(propertyKey, middleware);
    }
}
