/**
 * An interface for Middleware functions.
 * 
 * @param context - This is the Context object.
 * @param value - This is the return value of the previous Pipeline stage.
 * @returns - This must return a Promise.  The return value will be passed as the value parameter into the next stage of the Pipeline.
 * 
 */
export interface IMiddleware<T, U, V> {
    (context?: T, value?: U): Promise<V>;
}
