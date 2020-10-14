import { IMiddleware } from '../pipeline';
import { Context } from '../server';

export interface IServerMiddleware<T, U> extends IMiddleware<Context, T, U> {

}