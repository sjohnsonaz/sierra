import { Middleware, MiddlewareContext, MiddlewareReturn } from './Middleware';

/**
 * The PipelineExit class, when returned from a Middleware function, signals that the Pipeline should exit.
 */
export class PipelineExit {}

/**
 * Returns a PipelineExit object
 */
export function exit() {
    return new PipelineExit();
}

/**
 * The Pipeline class runs a series of Middleware async functions.
 */
export class Pipeline<CONTEXT = {}, VALUE = undefined, RESULT = void> {
    middlewares: Middleware<any, any, any>[] = [];

    // TODO: Should value be optional?
    async run(context: CONTEXT, value: VALUE) {
        let result: RESULT = value as any;
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
     * @param middleware - a Middleware function to add
     */
    use<NEW_CONTEXT, NEW_RESULT = RESULT>(
        middleware: Middleware<CONTEXT & NEW_CONTEXT, RESULT, NEW_RESULT>
    ): Pipeline<CONTEXT & NEW_CONTEXT, VALUE, NEW_RESULT>;
    use<MIDDLEWARE extends Middleware<any, any, any>>(
        middleware: MIDDLEWARE
    ): Pipeline<CONTEXT & MiddlewareContext<MIDDLEWARE>, VALUE, MiddlewareReturn<MIDDLEWARE>>;
    use(middleware: any): any {
        this.middlewares.push(middleware);
        return this as any;
    }

    /**
     * Removes a Middleware function from the Pipeline
     * @param middleware - a Middleware function to remove
     */
    remove(middleware: Middleware<CONTEXT, any, any>) {
        let index = this.middlewares.indexOf(middleware);
        if (index >= 0) {
            return this.middlewares.splice(index, 1);
        } else {
            return [];
        }
    }
}
