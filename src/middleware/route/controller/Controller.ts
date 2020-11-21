import * as path from 'path';

import { RouteGroup } from '../RouteGroup';

import { RouteBuilder } from './RouteBuilder';

export class Controller {
    _base?: string;
    _routeBuilder?: RouteBuilder;

    constructor(base?: string) {
        this._base = base;
    }

    static build(controller: Controller) {
        const routes = controller._routeBuilder?.build(controller);
        const routeGroup = new RouteGroup(controller._base || Controller.getName(controller));
        routes?.forEach(route => {
            routeGroup.add(route);
        });
        return routeGroup;
    }

    static getName(controller: Controller) {
        let { name } = controller.constructor;
        if (name) {
            name = name.toLowerCase();
            // Some anonymous Controllers may have this name
            if (name !== 'controller') {
                const results = name.match(/(.*)(service|controller|router)/);
                if (results && results[1]) {
                    name = results[1].toLowerCase();
                }
            } else {
                name = '';
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