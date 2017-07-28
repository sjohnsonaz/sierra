import { IMiddleware } from '../interfaces/IMiddleware';
import { IServerIntegration } from '../interfaces/IServerIntegration';

import Controller from '../implementations/Controller';

export default class Application<T, U extends IMiddleware> {
    controllers: Controller<T, U>[] = [];

    addController(controller: Controller<T, U>) {
        this.controllers.push(controller);
    }

    init() {
        this.connectDatabase();
        this.addMiddleware();
        this.buildRoutes();
    }

    addMiddleware() {

    }

    connectDatabase() {

    }

    buildRoutes() {
        this.controllers.forEach(this.buildRoute.bind(this));
    }

    buildRoute(controller: Controller<T, U>) {

    }

    listen() {

    }
}