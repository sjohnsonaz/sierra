import { IPipelineContext } from './IPipelineContext';

export interface IMiddleware<T, U, V extends IPipelineContext> {
    (context: T, value?: U): Promise<V>;
}