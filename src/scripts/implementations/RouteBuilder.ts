import { IServerIntegration } from '../interfaces/IServerIntegration';
import { IMiddleware } from '../interfaces/IMiddleware';
import { Verb, VerbLookup } from '../interfaces/Verb';

import { getArgumentNames, wrapMethod } from '../utils/FunctionUtil';

import Controller from './Controller';

export default class RouteBuilder<T, U extends IMiddleware> {
    routeNames: IRouteNames<U> = {};
    parent: RouteBuilder<T, U>;

    constructor(parent?: RouteBuilder<T, U>) {
        this.parent = parent;
    }

    addMiddleware(methodName: string, middleware: U) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].middleware.push(middleware);
    }

    addDefinition(methodName: string, verb: Verb, name: string | RegExp, pipeArgs: boolean = false) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].verb = verb;
        this.routeNames[methodName].name = name;
        this.routeNames[methodName].pipeArgs = pipeArgs;
    }

    build(app: T, controller: Controller<T, U>, integration: IServerIntegration<T, U>, base?: string) {
        if (this.parent) {
            this.parent.build(app, controller, integration);
        }
        for (var index in this.routeNames) {
            if (this.routeNames.hasOwnProperty(index)) {
                var routeName = this.routeNames[index];
                var middleware = routeName.middleware;
                var name = routeName.name;
                var verb = routeName.verb;
                if (VerbLookup.indexOf(index as any) >= 0) {
                    if (!verb) {
                        verb = index as any;
                    }
                    if (!name) {
                        name = '/' + RouteBuilder.getBase(controller, base) + '/';
                    }
                }
                if (!name) {
                    name = '/' + RouteBuilder.getBase(controller, base) + '/' + index + '/';
                }
                var method = controller[index];
                if (method) {
                    if (routeName.pipeArgs) {
                        name = name + getArgumentNames(method).map(function (value) {
                            return ':' + value;
                        }).join('/');
                        console.log(name);
                        method = wrapMethod(method, controller);
                    } else {
                        method = method.bind(controller);
                    }
                }
                integration(app, verb, name, middleware, method);
            }
        }
    }

    static getRouteBuilder<T, U extends IMiddleware>(target: Controller<T, U>) {
        if (target._routeBuilder) {
            if (!target.hasOwnProperty('_routeBuilder')) {
                target._routeBuilder = new RouteBuilder(target._routeBuilder);
            }
        } else {
            target._routeBuilder = new RouteBuilder();
        }
        return target._routeBuilder;
    }

    static getBase<T, U extends IMiddleware, W extends Controller<T, U>>(controller: W, base?: string) {
        if (base) {
            return base;
        } else {
            var name = (controller.constructor as any).name;
            if (name) {
                var results = name.match(/(.*)([sS]ervice|[cC]ontroller|[rR]outer)/);
                if (results && results[1]) {
                    name = results[1].toLowerCase();
                }
            }
            return name;
        }
    }
}

export class RouteDefinition<U extends IMiddleware> {
    verb: Verb;
    name: string | RegExp;
    middleware: U[] = [];
    pipeArgs: boolean = false;
}

export interface IRouteNames<U extends IMiddleware> {
    [index: string]: RouteDefinition<U>;
}
