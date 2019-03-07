import RouteBuilder from './RouteBuilder';
import Route from './Route';

export default class Controller {
    base: string;
    service: boolean = false;
    _routeBuilder: RouteBuilder;

    constructor(base?: string) {
        this.base = base;
    }

    build(): Route<any, any>[] {
        let routeHash = this._routeBuilder.build(this);
        return Object.values(routeHash);
    }
}
