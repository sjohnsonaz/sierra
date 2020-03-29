import Context from '../server/Context';

export interface IMiddleware<T, U, V extends Context = Context> {
    (context: V, value?: T): Promise<U>;
}