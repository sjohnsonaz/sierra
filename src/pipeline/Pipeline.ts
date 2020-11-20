/**
 * An interface for Middleware functions.
 * 
 * @param context - This is the Context object.
 * @param value - This is the return value of the previous Pipeline stage.
 * @returns - This must return a Promise.  The return value will be passed as the value parameter into the next stage of the Pipeline.
 * 
 */
export type Middleware<CONTEXT, VALUE, RESULT> =
    (context: CONTEXT, value?: VALUE) => Promise<RESULT>;


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
export class Pipeline<CONTEXT, VALUE, RESULT> {
    middlewares: Middleware<CONTEXT, any, any>[] = [];

    async run(context: CONTEXT, value?: VALUE) {
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
    use(middleware: Middleware<CONTEXT, any, any>) {
        this.middlewares.push(middleware);
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

