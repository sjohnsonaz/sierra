import * as path from 'path';
import 'reflect-metadata';

import { IServerMiddleware } from '../../server/IServerMiddleware';
import { Verb, VerbLookup } from './Verb';

import { getArgumentNames } from '../../utils/FunctionUtil';
import { stringToRegex } from '../../utils/RouteUtil';
import Controller from './Controller';
import Route from './Route';

import RouteDefinition, { RouteMethod } from './RouteDefinition';
import { Errors } from '../../server/Errors';

export interface IRouteDefinitionHash<U extends IServerMiddleware<any, any>> {
    [index: string]: RouteDefinition<U>;
}

export default class RouteBuilder {
    routeDefinitions: IRouteDefinitionHash<IServerMiddleware<any, any>> = {};
    parent: RouteBuilder;

    constructor(parent?: RouteBuilder) {
        this.parent = parent;
    }

    addMiddleware(methodName: string, middleware: IServerMiddleware<any, any>) {
        if (!this.routeDefinitions[methodName]) {
            this.routeDefinitions[methodName] = new RouteDefinition();
        }
        this.routeDefinitions[methodName].middleware.push(middleware);
    }

    unshiftMiddleware(methodName: string, middleware: IServerMiddleware<any, any>) {
        if (!this.routeDefinitions[methodName]) {
            this.routeDefinitions[methodName] = new RouteDefinition();
        }
        this.routeDefinitions[methodName].middleware.unshift(middleware);
    }

    addDefinition(methodName: string, verb: Verb, name: string | RegExp, pipeArgs?: boolean, override?: boolean) {
        if (!this.routeDefinitions[methodName]) {
            this.routeDefinitions[methodName] = new RouteDefinition();
        }
        this.routeDefinitions[methodName].method = new RouteMethod(verb, name, pipeArgs, override);;
    }

    getRouteDefinitions() {
        if (this.parent) {
            // Merge with existing RouteDefinitions
            let routeDefinitions = this.routeDefinitions;
            let parentRouteDefinitions: IRouteDefinitionHash<IServerMiddleware<any, any>> = this.parent.getRouteDefinitions();

            // Create merged object with values from this RouteBuilder
            let mergedRouteDefinitions: IRouteDefinitionHash<IServerMiddleware<any, any>> = {};
            let keys: string[] = RouteBuilder.getKeys(parentRouteDefinitions, routeDefinitions);
            keys.forEach(index => {
                let routeDefinition = routeDefinitions[index];
                let parentRouteDefinition = parentRouteDefinitions[index];

                // If a conflict exists, merge RouteDefinitions
                if (parentRouteDefinition && routeDefinition) {
                    let routeDefinition = new RouteDefinition();
                    if (routeDefinition.method) {
                        routeDefinition.method = routeDefinition.method;
                        routeDefinition.middleware = routeDefinition.middleware.concat(routeDefinition.middleware);
                    } else {
                        routeDefinition.method = parentRouteDefinition.method;
                        routeDefinition.middleware = routeDefinition.middleware.concat(routeDefinition.middleware, parentRouteDefinition.middleware);
                    }
                    mergedRouteDefinitions[index] = routeDefinition;
                } else {
                    mergedRouteDefinitions[index] = routeDefinition || parentRouteDefinition;
                }
            });
            return mergedRouteDefinitions;
        } else {
            return this.routeDefinitions;
        }
    }

    build(controller: Controller) {
        let routeDefinitions = this.getRouteDefinitions();
        return Object.keys(routeDefinitions).map(methodName => {
            let routeDefinition = routeDefinitions[methodName];
            var middleware = routeDefinition.middleware;
            var routeMethod = routeDefinition.method;
            if (!routeMethod) {
                throw Errors.noMethod + methodName;
            }
            var name = routeMethod.name || '';
            var verb = routeMethod.verb;
            var pipeArgs = routeMethod.pipeArgs;

            let argumentTypes;
            if (Reflect.getMetadata) {
                argumentTypes = Reflect.getMetadata("design:paramtypes", controller, methodName);
            }

            // Get argument names, and bind method
            var method = controller[methodName];
            if (method) {
                if (pipeArgs) {
                    var argumentNames = getArgumentNames(method);
                }
                method = method.bind(controller);
            }

            // Ensure index is lower case
            methodName = methodName.toLowerCase();

            // Do we have a verb already
            if (!verb) {
                if (VerbLookup.indexOf(methodName as any) >= 0) {
                    verb = methodName as any;
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

                    // Use controller base
                    nameParts.push(Controller.getBase(controller));

                    // If we have no name, attempt to create one
                    if (!name) {
                        // If the method isn't equal to the verb or 'index', use method in route
                        if (verb !== methodName && methodName !== 'index') {
                            nameParts.push(methodName);
                        }
                    } else {
                        // Use the name we have
                        nameParts.push(name);
                    }

                    // Build name
                    name = path.posix.join(...nameParts);

                    // Ensure preceeding '/'
                    if (!name.startsWith('/')) {
                        name = '/' + name;
                    }
                }
                name = path.posix.normalize(name);
                var regex = stringToRegex(name);
            } else {
                var regex = name;
            }

            let template = Controller.getTemplate(controller, methodName);

            return new Route(verb, name, regex, middleware, method, pipeArgs, argumentNames, template, argumentTypes);
        });
    }

    static getRouteBuilder(target: { _routeBuilder: RouteBuilder }) {
        if (target._routeBuilder) {
            if (!target.hasOwnProperty('_routeBuilder')) {
                target._routeBuilder = new RouteBuilder(target._routeBuilder);
            }
        } else {
            target._routeBuilder = new RouteBuilder();
        }
        return target._routeBuilder;
    }

    static getKeys(...objects: Object[]) {
        let keyHash: {
            [index: string]: string;
        } = {};
        objects.forEach(obj => {
            Object.keys(obj).forEach(key => {
                keyHash[key] = key;
            });
        });
        return Object.keys(keyHash);
    }
}