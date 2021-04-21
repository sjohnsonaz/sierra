import { Handler } from './Handler';

export type HandlerContext<T> = T extends Handler<infer U, any> ? U : never;
export type HandlerResult<T> = T extends Handler<any, infer U> ? U : never;
