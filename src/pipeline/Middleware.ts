/**
 * An interface for `Middleware` functions.
 *
 * @param context - This is the Context object.
 * @returns - This must return a `Promise`.  The return value will be passed as the value parameter into the next stage of the `Pipeline`.
 *
 */
export type Middleware<CONTEXT, RESULT> = (context: CONTEXT) => Promise<RESULT>;

export type MiddlewareContext<T> = T extends Middleware<infer U, any> ? U : never;

export type MiddlewareReturn<T> = T extends Middleware<any, infer U> ? U : never;
