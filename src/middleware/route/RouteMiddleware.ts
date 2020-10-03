import Context from '../../server/Context';
import { NoRouteFoundError } from '../../server/Errors';

import Route from './Route';

export default class RouteMiddleware {
    routes: Route<any, any>[] = [];
    handler = async (context: Context, value: any) => {
        let routes = this.routes.filter(route => {
            return (context.method === route.verb || route.verb === 'all') && !!context.pathname.match(route.regex);
        });
        if (routes.length) {
            let route = routes[0];
            context.template = route.template;
            context.params = createParams(context.pathname.match(route.regex), route.argumentNames);
            context.body = context.body || {};
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
                    $contentType: context.contentType,
                    $result: result
                };
                return await route.method.apply(route, route.argumentNames.map((name, index) => {
                    let value = contextParams[name as keyof typeof contextParams] || context.params[name] || context.query.get(name) || context.body[name];
                    let argumentType = route.argumentTypes[index];
                    if (argumentType) {
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
                            default:
                                //return new argumentType(value);
                                //console.log(name, argumentType, output);
                                output = value;
                                break;
                        }
                        return output;
                    } else {
                        return value;
                    }
                }));
            } else {
                return await route.method(context, result);
            }
        } else {
            throw new NoRouteFoundError();
        }
    }
}

function createParams(matches: string[], argumentNames: string[]) {
    let params: Record<string, string> = {};
    if (matches) {
        argumentNames.forEach((name, index) => {
            params[name] = matches[index + 1];
        });
    }
    return params;
}