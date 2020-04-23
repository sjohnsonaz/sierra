import { IPipelineContext } from './IPipelineContext';

// TODO: Should context be optional?
export interface IMiddleware<T, U, V extends IPipelineContext> {
    (context: T, value?: U): Promise<V>;
}