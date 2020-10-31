import * as path from 'path';
import 'reflect-metadata';

import { getArgumentNames, stringToRegex } from '../../utils/RouteUtil';
import { IServerMiddleware, NoMethodError, Verb, VerbLookup } from '../../server';

import { Controller } from './Controller';
import { Route } from './Route';
import { RouteDefinition, RouteMethod } from './RouteDefinition';
import { getVerb } from '../../server/Verb';

export class RouteBuilder {
    routeDefinitions: Record<string, RouteDefinition<IServerMiddleware<any, any>>> = {};
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
            let parentRouteDefinitions: Record<string, RouteDefinition<IServerMiddleware<any, any>>> = this.parent.getRouteDefinitions();

            // Create merged object with values from this RouteBuilder
            let mergedRouteDefinitions: Record<string, RouteDefinition<IServerMiddleware<any, any>>> = {};
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

    build<T extends Controller>(controller: T) {
        const routeDefinitions = this.getRouteDefinitions();
        return Object.keys(routeDefinitions).map(definitionName => {
            const methodName: keyof T = definitionName as any;
            const routeDefinition = routeDefinitions[definitionName];
            const middleware = routeDefinition.middleware;
            const routeMethod = routeDefinition.method;
            if (!routeMethod) {
                throw new NoMethodError(definitionName);
            }
            let name = routeMethod.name || '';
            let verb = routeMethod.verb;
            const pipeArgs = routeMethod.pipeArgs;

            let argumentTypes;
            if (Reflect.getMetadata) {
                argumentTypes = Reflect.getMetadata("design:paramtypes", controller, definitionName);
            }

            // Get argument names, and bind method
            let method: IServerMiddleware<unknown, unknown> = controller[definitionName as keyof typeof controller] as any;
            let argumentNames: string[];
            if (method) {
                if (pipeArgs) {
                    argumentNames = getArgumentNames(method);
                }
                method = method.bind(controller);
            }

            // Do we have a verb already
            if (!verb) {
                verb = getVerb(definitionName);
            }

            let regex: RegExp;
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
                        // Ensure index is lower case
                        const nameLowerCase = definitionName.toLowerCase();
                        if (verb !== nameLowerCase && nameLowerCase !== 'index') {
                            nameParts.push(nameLowerCase);
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
                regex = stringToRegex(name);
            } else {
                regex = name;
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