import { IMiddleware } from '../interfaces/IMiddleware';
import { IServerIntegration } from '../interfaces/IServerIntegration';

import RouteBuilder from './RouteBuilder';

export default class Controller<T, U extends IMiddleware<any, any>> {
    base: string;
    service: boolean = false;
    _routeBuilder: RouteBuilder<T, U>;

    constructor(base?: string) {
        this.base = base;
    }

    build(app: T, integration: IServerIntegration<T, U>) {
        this._routeBuilder.build(app, this, integration);
    }
}
