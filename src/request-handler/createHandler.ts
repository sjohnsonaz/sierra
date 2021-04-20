import { Context } from './Context';
import { RequestHandler } from './RequestHandler';

export function createHandler<CONTEXT extends Context = Context, RESULT = void>() {
    return new RequestHandler<CONTEXT, RESULT>();
}
