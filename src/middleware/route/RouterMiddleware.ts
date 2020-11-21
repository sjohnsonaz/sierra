import { Context, NoRouteFoundError } from "../../server";
import { Route } from "./Route";
import { RouteGroup } from "./RouteGroup";

export class RouterMiddleware extends RouteGroup {

    init() {
        const routes = super.init();
        this.routes.sort(sortRoutes);
        return routes;
    }

    handle = async (context: Context, value?: any) => {
        const pathname = getPathname(context);
        // Find a matching route
        let route: Route<any, any> | undefined = undefined;
        // Store match array
        let match: null | RegExpMatchArray = null;
        for (let _route of this.routes) {
            match = _route.match(context.method, pathname);
            if (match) {
                route = _route;
                break;
            }
        }
        if (route) {
            return route.run(context, value, match);
        } else {
            throw new NoRouteFoundError();
        }
    }
}

/**
 * Compares two Routes for sorting.
 * @param routeA - the first Route
 * @param routeB - the second Route
 */
export function sortRoutes(routeA: Route<any, any>, routeB: Route<any, any>) {
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
