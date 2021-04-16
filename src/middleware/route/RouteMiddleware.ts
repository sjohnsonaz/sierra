import { Context, NoRouteFoundError } from '../../server';
import { Controller } from './controller';
import { Route } from './Route';
import { RouteGroup } from './RouteGroup';

export class RouteMiddleware extends RouteGroup {
    allRoutes: Route<any, any, any>[] = [];
    controllers: Controller[] = [];

    init() {
        const allRoutes = super.init();
        for (let controller of this.controllers) {
            const routeGroups = Controller.build(controller);
            const controllerRoutes = routeGroups.init();
            for (let controllerRoute of controllerRoutes) {
                allRoutes.push(controllerRoute);
            }
        }
        this.allRoutes = allRoutes;
        this.allRoutes.sort(sortRoutes);
        return allRoutes;
    }

    handle = async (context: Context, value?: any) => {
        const pathname = getPathname(context);
        // Find a matching route
        let route: Route<any, any, any> | undefined = undefined;
        // Store match array
        let match: null | RegExpMatchArray = null;
        for (let _route of this.allRoutes) {
            match = _route.match(context.method, pathname);
            if (match) {
                route = _route;
                break;
            }
        }
        if (route) {
            return route.run(context as any, value, match);
        } else {
            throw new NoRouteFoundError();
        }
    };

    /**
     * Adds a Controller to RouteMiddleware
     * @param controller - the Controller to add
     */
    addController(controller: Controller) {
        return this.controllers.push(controller);
    }

    /**
     * Removes a Controller from RouteMiddleware
     * @param controller - the Controller to remove
     */
    removeController(controller: Controller) {
        const index = this.controllers.indexOf(controller);
        if (index >= 0) {
            return !!this.controllers.splice(index).length;
        } else {
            return false;
        }
    }
}

/**
 * Compares two Routes for sorting.
 * @param routeA - the first Route
 * @param routeB - the second Route
 */
export function sortRoutes(routeA: Route<any, any, any>, routeB: Route<any, any, any>) {
    return (routeA.config?.firstParamIndex || 0) - (routeB.config?.firstParamIndex || 0);
}

function getPathname(context: Context) {
    // Remove ending '/' from pathname, unless only single '/'.
    let pathname = context.url.pathname;
    if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }
    return pathname;
}
