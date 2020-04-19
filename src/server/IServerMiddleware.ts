import { IMiddleware } from "../pipeline/IMiddleware";
import { Context } from "../Sierra";

export interface IServerMiddleware<T, U> extends IMiddleware<Context, T, U> {

}