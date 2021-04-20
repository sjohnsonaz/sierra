import { Handler } from '../handler';

import { PromiseServer } from './PromiseServer';

export function createServer<HANDLER extends Handler<any, any>>(
    handler: HANDLER
): PromiseServer<HANDLER> {
    return new PromiseServer(handler);
}
