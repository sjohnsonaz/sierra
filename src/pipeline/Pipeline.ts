import { CaptureDirective, DirectiveType, exit, Directive } from './directive';
import { Middleware, MiddlewareContext, MiddlewareReturn } from './Middleware';

/**
 * The `Pipeline` class runs a series of `Middleware` async functions.
 */
export class Pipeline<CONTEXT = {}, RESULT = void> {
    middlewares: Middleware<any, any>[] = [];

    async run(context: CONTEXT): Promise<Directive<RESULT>> {
        const captures: CaptureDirective[] = [];
        let result: any;
        for (let index = 0, length = this.middlewares.length; index < length; index++) {
            result = await this.middlewares[index](context);
            if (typeof result !== 'undefined') {
                if (result instanceof Directive) {
                    if (result.type === DirectiveType.Capture) {
                        captures.push(result);
                    } else {
                        break;
                    }
                } else {
                    result = exit(result);
                    break;
                }
            }
        }
        if (!(result instanceof Directive)) {
            result = exit(result);
        }
        for (let capture of captures.reverse()) {
            result = await capture.value(result);
        }
        return result;
    }

    /**
     * Adds a `Middleware` function to the `Pipeline`
     * @param middleware - a Middleware function to add
     */
    // TODO: Should `NEW_CONTEXT` be `Partial<NEW_CONTEXT>`?
    use<NEW_CONTEXT, NEW_RESULT = RESULT>(
        middleware: Middleware<CONTEXT & NEW_CONTEXT, NEW_RESULT>
    ): Pipeline<CONTEXT & NEW_CONTEXT, NEW_RESULT>;
    use<MIDDLEWARE extends Middleware<any, any>>(
        middleware: MIDDLEWARE
    ): Pipeline<CONTEXT & MiddlewareContext<MIDDLEWARE>, MiddlewareReturn<MIDDLEWARE>>;
    use(middleware: Middleware<any, any>): Pipeline<CONTEXT & RESULT> {
        this.middlewares.push(middleware);
        return this as any;
    }

    /**
     * Removes a `Middleware` function from the `Pipeline`
     * @param middleware - a Middleware function to remove
     */
    remove(middleware: Middleware<any, any>) {
        let index = this.middlewares.indexOf(middleware);
        if (index >= 0) {
            return this.middlewares.splice(index, 1);
        } else {
            return [];
        }
    }
}

export function pipeline<CONTEXT, RESULT>() {
    return new Pipeline<CONTEXT, RESULT>();
}
