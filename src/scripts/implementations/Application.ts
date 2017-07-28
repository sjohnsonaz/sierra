import { IMiddleware } from '../interfaces/IMiddleware';
import { IServerIntegration } from '../interfaces/IServerIntegration';

import Controller from '../implementations/Controller';

export default abstract class Application<T, U extends IMiddleware> {
    controllers: Controller<T, U>[] = [];

    addController(controller: Controller<T, U>) {
        this.controllers.push(controller);
    }

    init() {
        this.connectDatabase();
        this.addMiddleware();
        this.buildRoutes();
    }

    buildRoutes() {
        this.controllers.forEach(this.buildRoute.bind(this));
    }

    abstract addMiddleware(): void;

    abstract connectDatabase(): void;

    abstract buildRoute(controller: Controller<T, U>): void;

    abstract listen(): void;
}