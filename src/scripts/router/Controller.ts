import { IMiddleware } from '../server/IMiddleware';

import RouteBuilder from './RouteBuilder';
import RequestHandler from '../server/RequestHandler';
import Route from './Route';

export default class Controller {
    base: string;
    service: boolean = false;
    _routeBuilder: RouteBuilder;

    constructor(base?: string) {
        this.base = base;
    }

    build(): Route<any, any>[] {
        return this._routeBuilder.build(this);
    }
}
