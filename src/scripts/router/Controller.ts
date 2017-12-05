import { IMiddleware } from '../server/IMiddleware';

import RouteBuilder from './RouteBuilder';
import RequestHandler from '../server/RequestHandler';

export default class Controller {
    base: string;
    service: boolean = false;
    _routeBuilder: RouteBuilder;

    constructor(base?: string) {
        this.base = base;
    }

    build() {
        return this._routeBuilder.build(this);
    }
}
