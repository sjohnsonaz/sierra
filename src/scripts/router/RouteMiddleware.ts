import * as Url from 'url';

import { IMiddleware } from '../server/IMiddleware';
import Context from '../server/Context';

import Route from './Route';

export default class RouteMiddleware {
    routes: Route<any, any>[] = [];
    handler: IMiddleware<any, void> = async (context: Context, value: any) => {
        let pathname = Url.parse(context.request.url).pathname;
        let routes = this.routes.filter(route => {
            let matches = pathname.match(route.name)
            return !!matches;
        });
        if (routes.length) {
            let route = routes[0];
            let result = value;
            for (let index = 0, length = route.middlewares.length; index < length; index++) {
                result = await route.middlewares[index](context, result);
            }
            return await route.method(context, result);
        } else {
            throw 'No route found';
        }
    }
}