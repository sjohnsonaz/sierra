import { IMiddleware } from '../pipeline/IMiddleware';
import { Context } from '../server/Context';

export interface IServerMiddleware<T, U> extends IMiddleware<Context, T, U> {

}