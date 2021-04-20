import { Context } from './Context';
import { Handler } from './Handler';

export function createHandler<CONTEXT extends Context = Context, RESULT = void>() {
    return new Handler<CONTEXT, RESULT>();
}
