import * as Url from 'url';

import { IMiddleware } from '../server/IMiddleware';
import Context from '../server/Context';
import { Errors } from '../server/Errors';

import Route from '../router/Route';

export default class RouteMiddleware {
    routes: Route<any, any>[] = [];
    handler: IMiddleware<any, void> = async (context: Context, value: any) => {
        let routes = this.routes.filter(route => {
            return (context.method === route.verb || route.verb === 'all') && !!context.pathname.match(route.regex);
        });
        if (routes.length) {
            let route = routes[0];
            context.template = route.template;
            context.params = createParams(context.pathname.match(route.regex), route.argumentNames);
            let result = value;
            for (let index = 0, length = route.middlewares.length; index < length; index++) {
                result = await route.middlewares[index](context, result);
            }
            if (route.pipeArgs) {
                let contextParams = {
                    $context: context,
                    $request: context.request,
                    $response: context.response,
                    $body: context.body,
                    $session: context.session,
                    $query: context.query,
                    $params: context.params,
                    $accept: context.accept,
                    $contentType: context.contentType
                };
                return await route.method.apply(route, route.argumentNames.map(name => contextParams[name] || context.params[name] || context.query[name]));
            } else {
                return await route.method(context, result);
            }
        } else {
            throw Errors.noRouteFound;
        }
    }
}

function createParams(matches: string[], argumentNames: string[]) {
    let params = {};
    if (matches) {
        argumentNames.forEach((name, index) => {
            params[name] = matches[index + 1];
        });
    }
    return params;
}