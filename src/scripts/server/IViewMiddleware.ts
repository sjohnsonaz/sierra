import Context from './Context';
import { IServerMiddleware } from './IServerMiddleware';

export interface IViewMiddleware<T> extends IServerMiddleware<T, string> {
    (context: Context, value: T, template: string): Promise<string>;
}