import { Context, NoRouteFoundError } from '../../server';

import { Controller } from './Controller';
import { Route } from './Route';

export class RouteMiddleware {
    routes: Route<any, any>[] = [];
    controllers: Controller[] = [];
    factories: Record<string, { (...args: any): any }> = {};
    castValue: (argumentType: any, value: any) => any = (argumentType, value) => {
        let output;
        switch (argumentType) {
            case String:
                output = value ?? undefined;
                break;
            case Number:
                output = parseFloat(value);
                break;
            case Boolean:
                output = ((value ?? '').toString() as string).toLowerCase() === 'true'
                break;
            case Object:
                output = value;
            default:
                const factory = this.getFactory(argumentType);
                if (factory) {
                    return factory(value);
                } else {
                    output = value;
                }
                break;
        }
        return output;
    };

    handler = async (context: Context, value: any) => {
        // Remove ending '/' from pathname, unless only single '/'.
        let pathname = context.url.pathname;
        if (pathname !== '/' && pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }

        let routes = this.routes.filter(route => {
            return (context.method === route.verb || route.verb === 'all') && !!pathname.match(route.regex);
        });
        if (routes.length) {
            let route = routes[0];
            context.template = route.template;
            const match = pathname.match(route.regex);
            context.data.query = context.data.query || {};
            context.data.params = match ? createParams(match, route.argumentNames) : {};
            context.data.body = context.data.body || {};
            let result = value;
            for (let index = 0, length = route.middlewares.length; index < length; index++) {
                result = await route.middlewares[index](context, result);
            }
            if (route.pipeArgs) {
                const contextParams = {
                    $context: context,
                    $request: context.request,
                    $response: context.response,
                    $body: context.data.body,
                    $session: context.data.session,
                    $query: context.data.query,
                    $params: context.data.params,
                    $accept: context.accept,
                    $contentType: context.contentType,
                    $result: result
                };
                return await route.method.apply(route, route.argumentNames.map((name, index) => {
                    let value = contextParams[name as keyof typeof contextParams] || contextParams.$params[name] || contextParams.$query[name] || contextParams.$body[name];
                    let argumentType = route.argumentTypes[index];
                    if (argumentType && this.castValue) {
                        return this.castValue(argumentType, value);
                    } else {
                        return value;
                    }
                    // TODO: Fix this any
                }) as any);
            } else {
                return await route.method(context, result);
            }
        } else {
            throw new NoRouteFoundError();
        }
    }

    /**
     * Adds a Controller
     * @param controller - the Controller to add
     */
    addController(controller: Controller) {
        this.controllers.push(controller);
    }

    /**
     * Removes a Controller
     * @param controller - the Controller to remove
     */
    removeController(controller: Controller) {
        const index = this.controllers.indexOf(controller);
        if (index >= 0) {
            return this.controllers.splice(index, 1);
        } else {
            return [];
        }
    }

    /**
     * Creates Routes for all Controllers
     */
    async init() {
        this.controllers.forEach(controller => {
            Controller.build(controller).forEach(route => {
                this.routes.push(route);
            });
        });

        // Sort Routes

        // Separate string Routes
        let regexRoutes: Route<any, any>[] = [];
        let stringRoutes: Route<any, any>[] = [];
        this.routes.forEach(route => {
            if (route.name instanceof RegExp) {
                regexRoutes.push(route);
            } else {
                stringRoutes.push(route);
            }
        });

        // Sort string Routes
        stringRoutes.sort(sortRoutes);

        // Concat all Routes
        this.routes = regexRoutes.concat(stringRoutes);
    }

    // TODO: Match args type
    addFactory<T, U>(constructor: { new(...args: any): T }, factory: (...args: any) => T) {
        const name = constructor.name;
        this.factories[name] = factory;
    }

    removeFactory(constructor: { new(...args: any): any }) {
        const name = constructor.name;
        delete this.factories[name];
    }

    // TODO: Match args type
    getFactory<T>(constructor: { new(...args: any): T }): (...args: any) => T {
        const name = constructor.name;
        return this.factories[name];
    }
}

function createParams(matches: string[], argumentNames: string[]) {
    const params: Record<string, string> = {};
    if (matches) {
        argumentNames.forEach((name, index) => {
            params[name] = matches[index + 1];
        });
    }
    return Object.freeze(params);
}

/**
 * Compares two Routes for sorting.
 * @param routeA - the first Route
 * @param routeB - the second Route
 */
export function sortRoutes(routeA: Route<any, any>, routeB: Route<any, any>) {
    let a = routeA.name as string;
    let b = routeB.name as string;
    let aParts = a.substr(1).split('/');
    let bParts = b.substr(1).split('/');
    let length = Math.max(aParts.length, bParts.length);
    let result = 0;
    for (let index = 0; index < length; index++) {
        let aPart = aParts[index] || '';
        let bPart = bParts[index] || '';
        result = ((aPart[0] === ':') as any) - ((bPart[0] === ':') as any);
        if (result) {
            break;
        }
    }
    return result;
}
