import { IMiddleware } from '../server/IMiddleware';
import { Verb, VerbLookup } from '../router/Verb';

import { getArgumentNames, wrapMethod } from '../utils/FunctionUtil';
import RouteUtil from '../utils/RouteUtil';
import Controller from './Controller';
import Route from './Route';
import RequestHandler from '../server/RequestHandler';

export default class RouteBuilder {
    routeNames: IRouteNames<IMiddleware<any, any>> = {};
    parent: RouteBuilder;

    constructor(parent?: RouteBuilder) {
        this.parent = parent;
    }

    addMiddleware(methodName: string, middleware: IMiddleware<any, any>) {
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

    build(controller: Controller, base?: string) {
        let routes: Route<any, any>[];
        if (this.parent) {
            routes = this.parent.build(controller);
        } else {
            routes = [];
        }
        for (var index in this.routeNames) {
            if (this.routeNames.hasOwnProperty(index)) {
                var routeName = this.routeNames[index];
                var middleware = routeName.middleware;
                var name = routeName.name;
                var verb = routeName.verb;
                var pipeArgs = routeName.pipeArgs;
                let nameParts = [];
                // If we don't have a name, use controller name
                if (!name) {
                    if (base && base !== '/') {
                        nameParts.push(base);
                    }
                    nameParts.push(RouteBuilder.getBase(controller));
                }
                // Are we using a verb method name
                if (VerbLookup.indexOf(index as any) >= 0) {
                    // Do we have a verb already
                    if (!verb) {
                        verb = index as any;
                    }
                } else {
                    // If we have a non-verb name, use name in route
                    nameParts.push(index);
                }
                // Build name
                if (!name) {
                    name = nameParts.join('/');
                }
                // Ensure preceeding '/'
                if (typeof name === 'string' && !name.startsWith('/')) {
                    name = '/' + name;
                }
                var method = controller[index];
                if (method) {
                    if (routeName.pipeArgs && !(name instanceof RegExp)) {
                        var argumentNames = getArgumentNames(method);
                        if (name.indexOf(':') === -1) {
                            name = name + '/' + argumentNames.map(function (value) {
                                return ':' + value;
                            }).join('/');
                        }
                        method = method.bind(controller);
                    } else {
                        method = method.bind(controller);
                    }
                }
                if (!(name instanceof RegExp)) {
                    name = RouteUtil.stringToRegex(name.toLowerCase());
                }
                let template = RouteBuilder.getTemplate(controller, index);
                routes.push(new Route(verb, name, middleware, method, pipeArgs, argumentNames, template));
            }
        }
        return routes;
    }

    static getRouteBuilder<T, U extends IMiddleware<any, any>>(target: Controller) {
        if (target._routeBuilder) {
            if (!target.hasOwnProperty('_routeBuilder')) {
                target._routeBuilder = new RouteBuilder(target._routeBuilder);
            }
        } else {
            target._routeBuilder = new RouteBuilder();
        }
        return target._routeBuilder;
    }

    static getBase<T, U extends IMiddleware<any, any>, W extends Controller>(controller: W) {
        if (controller.base) {
            return controller.base === '/' ? '' : controller.base;
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


    static getTemplate<T, U extends IMiddleware<any, any>, W extends Controller>(controller: W, index: string) {
        var name = (controller.constructor as any).name;
        if (name) {
            var results = name.match(/(.*)([sS]ervice|[cC]ontroller|[rR]outer)/);
            if (results && results[1]) {
                name = results[1].toLowerCase();
            }
        }
        return name + '/' + index;
    }
}

export class RouteDefinition<U extends IMiddleware<any, any>> {
    verb: Verb;
    name: string | RegExp;
    middleware: U[] = [];
    pipeArgs: boolean = false;
}

export interface IRouteNames<U extends IMiddleware<any, any>> {
    [index: string]: RouteDefinition<U>;
}
