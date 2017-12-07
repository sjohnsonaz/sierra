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

    build(controller: Controller) {
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
                var name = routeName.name || '';
                var verb = routeName.verb;
                var pipeArgs = routeName.pipeArgs;

                // Get argument names, and bind method
                var method = controller[index];
                if (method) {
                    if (routeName.pipeArgs) {
                        var argumentNames = getArgumentNames(method);
                    }
                    method = method.bind(controller);
                }

                // Ensure index is lower case
                index = index.toLowerCase();

                // Do we have a verb already
                if (!verb) {
                    if (VerbLookup.indexOf(index as any) >= 0) {
                        verb = index as any;
                    }
                }

                // If name is a RegExp, we are done
                if (!(name instanceof RegExp)) {
                    // If name starts with ~/, we must only remove the ~, and we are done
                    if (name.startsWith('~/')) {
                        name = name.substr(1);
                    } else {
                        // Else, assemble string
                        let nameParts = [];

                        // Use controller name
                        nameParts.push(RouteBuilder.getBase(controller));

                        // If we have no name, attempt to create one
                        if (!name) {
                            // If we have a non-verb name, use name in route
                            if (verb !== index) {
                                nameParts.push(index);
                            }
                        } else {
                            // Ensure name does not start with /
                            if (name[0] === '/') {
                                name = name.substr(1);
                            }

                            // Use the name we have
                            nameParts.push(name);
                        }

                        // Build name
                        name = nameParts.join('/');

                        // Ensure preceeding '/'
                        if (typeof name === 'string' && !name.startsWith('/')) {
                            name = '/' + name;
                        }
                    }
                    var regex = RouteUtil.stringToRegex(name);
                } else {
                    var regex = name;
                }

                let template = RouteBuilder.getTemplate(controller, index);
                routes.push(new Route(verb, name, regex, middleware, method, pipeArgs, argumentNames, template));
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
