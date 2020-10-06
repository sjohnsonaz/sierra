import * as path from 'path';

import RouteBuilder from './RouteBuilder';
import Route from './Route';

export default class Controller {
    _base: string;
    _routeBuilder: RouteBuilder;

    constructor(base?: string) {
        this._base = base;
    }

    static build(controller: Controller): Route<any, any>[] {
        let routeHash = controller._routeBuilder.build(controller);
        return Object.values(routeHash);
    }

    static getName(controller: Controller) {
        let { name } = controller.constructor;
        if (name) {
            name = name.toLowerCase();
            const results = name.match(/(.*)(service|controller|router)/);
            if (results && results[1]) {
                name = results[1].toLowerCase();
            }
        } else {
            name = '';
            // TODO: Change to exception
            // throw 'no controller name';
        }
        return name;
    }

    static getBase(controller: Controller) {
        if (controller._base) {
            return controller._base;
        } else {
            let name = Controller.getName(controller);
            if (name === 'index' || name === 'home') {
                name = '';
            }
            return name;
        }
    }

    static getTemplate<T extends Controller>(controller: T, index: keyof T) {
        return path.join(Controller.getName(controller), index.toString());
    }
}