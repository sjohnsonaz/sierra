import * as path from 'path';

import { Middleware } from '../../pipeline';
import { Context, Verb } from '../../server';

import { Endpoint } from './Endpoint';

export class RouteGroup {
    base: string;
    endpoints: Endpoint<any, any, any>[] = [];
    routeGroups: RouteGroup[] = [];

    constructor(base: string = '') {
        this.base = base;
    }

    // TODO: Change to non-overload
    endpoint(
        verbs: Verb | Verb[],
        name: string | RegExp,
        method: Middleware<Context, any, any>
    ): Endpoint<any, any, any>;
    endpoint(
        verbs: Verb | Verb[],
        name: string | RegExp,
        middleware: Middleware<Context, any, any>[],
        method: Middleware<Context, any, any>
    ): Endpoint<any, any, any>;
    endpoint(verbs: Verb | Verb[], name: string | RegExp, a: any, b?: any) {
        let route = new Endpoint(verbs, name, a, b);
        this.endpoints.push(route);
        return route;
    }

    add(endpoint: Endpoint<any, any, any>) {
        this.endpoints.push(endpoint);
    }

    remove(endpoint: Endpoint<any, any, any>) {
        const index = this.endpoints.indexOf(endpoint);
        if (index >= 0) {
            return !!this.endpoints.splice(index, 1).length;
        } else {
            return false;
        }
    }

    removeByName(name: string | RegExp) {
        const index = this.endpoints.findIndex((endpoint) => endpoint.name === name);
        if (index >= 0) {
            return !!this.endpoints.splice(index, 1).length;
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
        const routes: Endpoint<any, any, any>[] = [];
        for (let route of this.endpoints) {
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
