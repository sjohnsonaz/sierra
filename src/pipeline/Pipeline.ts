import { IMiddleware } from './IMiddleware';
import { IPipelineContext } from './IPipelineContext';

/**
 * The PipelineExit class, when returned from a Middleware function, signals that the Pipeline should exit.
 */
export class PipelineExit {

}

/**
 * Returns a PipelineExit object
 */
export function exit() {
    return new PipelineExit();
}

/**
 * The Pipeline class runs a series of Middleware async functions.
 */
export class Pipeline<T extends IPipelineContext, U, V> {
    middlewares: IMiddleware<T, any, any>[] = [];

    async run(context?: T, value?: U) {
        let result: V = value as any;
        for (let index = 0, length = this.middlewares.length; index < length; index++) {
            result = await this.middlewares[index](context, result);
            if (result instanceof PipelineExit) {
                break;
            }
        }
        return result;
    }

    /**
     * Adds a Middleware function to the Pipeline
     * @param middlware - a Middleware function to add
     */
    use(middlware: IMiddleware<T, any, any>) {
        this.middlewares.push(middlware);
    }

    /**
     * Removes a Middleware function from the Pipeline
     * @param middleware - a Middleware function to remove
     */
    remove(middleware: IMiddleware<T, any, any>) {
        let index = this.middlewares.indexOf(middleware);
        if (index >= 0) {
            return this.middlewares.splice(index, 1);
        } else {
            return [];
        }
    }
}