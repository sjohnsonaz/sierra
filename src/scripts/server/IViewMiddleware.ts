import { IMiddleware } from './IMiddleware';
import Context from './Context';

export interface IViewMiddleware<T> {
    (context: Context, value: T, template: string): Promise<string>;
}