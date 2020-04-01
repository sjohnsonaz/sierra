import { IServerMiddleware } from '../../server/IServerMiddleware';
import { Verb } from './Verb';

export class RouteMethod {
    verb: Verb;
    name: string | RegExp;
    pipeArgs: boolean;
    override: boolean;

    constructor(verb: Verb, name: string | RegExp, pipeArgs: boolean, override: boolean) {
        this.verb = verb;
        this.name = name;
        this.pipeArgs = pipeArgs;
        this.override = override;
    }
}

export default class RouteDefinition<U extends IServerMiddleware<any, any>> {
    method: RouteMethod;
    middleware: U[] = [];
}