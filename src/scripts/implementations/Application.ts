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

    buildRoutes() {
        console.log('Building routes: ' + this.controllers.length);
        this.controllers.forEach(this.buildRoute.bind(this));
    }

    connectDatabase(): Promise<boolean> {
        return Promise.resolve(true);
    }

    addMiddleware(): void {

    }

    buildRoute(controller: Controller<T, U>): void {

    }

    listen(): Promise<boolean> {
        return Promise.resolve(true);
    }

    close(): Promise<boolean> {
        return Promise.resolve(true);
    }
}