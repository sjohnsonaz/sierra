import 'reflect-metadata';

import { Context, NoMethodError, Verb } from '../../../server';
import { Middleware } from '../../../pipeline';

import { Endpoint } from '../Endpoint';

import { Controller } from './Controller';
import { RouteDefinition, RouteMethod } from './RouteDefinition';

export class RouteBuilder {
    routeDefinitions: Record<string, RouteDefinition<Middleware<Context, any, any>>> = {};
    parent?: RouteBuilder;

    constructor(parent?: RouteBuilder) {
        this.parent = parent;
    }

    addMiddleware(methodName: string, middleware: Middleware<Context, any, any>) {
        if (!this.routeDefinitions[methodName]) {
            this.routeDefinitions[methodName] = new RouteDefinition();
        }
        this.routeDefinitions[methodName].middleware.push(middleware);
    }

    unshiftMiddleware(methodName: string, middleware: Middleware<Context, any, any>) {
        if (!this.routeDefinitions[methodName]) {
            this.routeDefinitions[methodName] = new RouteDefinition();
        }
        this.routeDefinitions[methodName].middleware.unshift(middleware);
    }

    addRoute(methodName: string, verbs: Verb[], name: string | RegExp, template?: string) {
        if (!this.routeDefinitions[methodName]) {
            this.routeDefinitions[methodName] = new RouteDefinition();
        }
        this.routeDefinitions[methodName].method = new RouteMethod(verbs, name, template);
    }

    getRouteDefinitions() {
        if (this.parent) {
            // Merge with existing RouteDefinitions
            let routeDefinitions = this.routeDefinitions;
            let parentRouteDefinitions: Record<
                string,
                RouteDefinition<Middleware<Context, any, any>>
            > = this.parent.getRouteDefinitions();

            // Create merged object with values from this RouteBuilder
            let mergedRouteDefinitions: Record<
                string,
                RouteDefinition<Middleware<Context, any, any>>
            > = {};
            let keys: string[] = RouteBuilder.getKeys(parentRouteDefinitions, routeDefinitions);
            keys.forEach((index) => {
                let routeDefinition = routeDefinitions[index];
                let parentRouteDefinition = parentRouteDefinitions[index];

                // If a conflict exists, merge RouteDefinitions
                if (parentRouteDefinition && routeDefinition) {
                    let routeDefinition = new RouteDefinition();
                    if (routeDefinition.method) {
                        routeDefinition.method = routeDefinition.method;
                        routeDefinition.middleware = routeDefinition.middleware.concat(
                            routeDefinition.middleware
                        );
                    } else {
                        routeDefinition.method = parentRouteDefinition.method;
                        routeDefinition.middleware = routeDefinition.middleware.concat(
                            routeDefinition.middleware,
                            parentRouteDefinition.middleware
                        );
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
        return Object.keys(routeDefinitions).map((definitionName) => {
            const methodName: keyof T = definitionName as any;
            const routeDefinition = routeDefinitions[definitionName];

            // Get method
            let method: Middleware<Context, unknown, unknown> = controller[
                definitionName as keyof typeof controller
            ] as any;
            if (!method) {
                throw new NoMethodError(definitionName);
            } else {
                method = method.bind(controller);
            }

            // Get template
            const template = Controller.getTemplate(controller, methodName);

            // Create Route
            const route = routeDefinition.createRoute(definitionName, method, template);

            return route;
        });
    }

    static getRouteBuilder(target: { _routeBuilder?: RouteBuilder }) {
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
        objects.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
                keyHash[key] = key;
            });
        });
        return Object.keys(keyHash);
    }
}
