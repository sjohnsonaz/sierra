import * as path from 'path';

import { Middleware } from "../../pipeline";
import { Context, Verb } from "../../server";

import { Route } from "./Route";

export class RouteGroup {
    base: string;
    routes: Route<any, any>[] = [];
    routeGroups: RouteGroup[] = [];

    constructor(base: string = '') {
        this.base = base;
    }

    // TODO: Change to non-overload
    route(
        verbs: Verb | Verb[],
        name: string | RegExp,
        method: Middleware<Context, any, any>
    ): Route<any, any>;
    route(
        verbs: Verb | Verb[],
        name: string | RegExp,
        middleware: Middleware<Context, any, any>[],
        method: Middleware<Context, any, any>,
    ): Route<any, any>;
    route(
        verbs: Verb | Verb[],
        name: string | RegExp,
        a: any,
        b?: any
    ) {
        let route = new Route(verbs, name, a, b);
        this.routes.push(route);
        return route;
    }

    add(route: Route<any, any>) {
        this.routes.push(route);
    }

    remove(route: Route<any, any>) {
        const index = this.routes.indexOf(route);
        if (index >= 0) {
            return !!this.routes.splice(index, 1).length;
        } else {
            return false;
        }
    }

    removeByName(name: string | RegExp) {
        const index = this.routes.findIndex(route => route.name === name);
        if (index >= 0) {
            return !!this.routes.splice(index, 1).length;
        } else {
            return false;
        }
    }

    addGroup(group: RouteGroup) {
        this.routeGroups.push(group);
    }

    removeGroup(group: RouteGroup) {
        const index = this.routeGroups.indexOf(group);
        if (index >= 0) {
            return !!this.routeGroups.splice(index, 1).length;
        } else {
            return false;
        }
    }

    init(parentBase: string = '/') {
        const base = path.posix.join(parentBase, this.base);
        const routes: Route<any, any>[] = [];
        for (let route of this.routes) {
            route.init(base);
            routes.push(route);
        }
        for (let routeGroup of this.routeGroups) {
            const groupRoutes = routeGroup.init(base);
            for (let groupRoute of groupRoutes) {
                routes.push(groupRoute);
            }
        }
        return routes;
    }
}
