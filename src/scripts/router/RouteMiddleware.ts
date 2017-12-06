import * as Url from 'url';

import { IMiddleware } from '../server/IMiddleware';
import Context from '../server/Context';

import Route from './Route';

export default class RouteMiddleware {
    routes: Route<any, any>[] = [];
    handler: IMiddleware<any, void> = async (context: Context, value: any) => {
        let routes = this.routes.filter(route => {
            return (context.method === route.verb || route.verb === 'all') && !!context.pathname.match(route.name);
        });
        if (routes.length) {
            let route = routes[0];
            context.params = createParams(context.pathname.match(route.name), route.argumentNames);
            let result = value;
            for (let index = 0, length = route.middlewares.length; index < length; index++) {
                result = await route.middlewares[index](context, result);
            }
            if (route.pipeArgs) {
                return await route.method.apply(route, route.argumentNames.map(name => context.params[name] || context.query[name]));
            } else {
                return await route.method(context, result);
            }
        } else {
            throw 'No route found';
        }
    }
}

function createParams(matches: string[], argumentNames: string[]) {
    let params = {};
    argumentNames.forEach((name, index) => {
        params[name] = matches[index + 1];
    });
    return params;
}