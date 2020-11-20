import { Pipeline } from "./Pipeline";

export type InnerMiddleware<CONTEXT, VALUE, RESULT, INNER_VALUE, INNER_RESULT> =
    (context: CONTEXT, value: VALUE, next?: MiddlewareNext<INNER_VALUE, INNER_RESULT>) => Promise<RESULT>;
type MiddlewareNext<VALUE, RESULT> =
    (value: VALUE) => Promise<RESULT | undefined>;

export class InnerPipeline<CONTEXT, VALUE, RESULT, INNER_VALUE, INNER_RESULT> {
    pipeline = new Pipeline<CONTEXT, INNER_VALUE, INNER_RESULT>();
    middleware: InnerMiddleware<CONTEXT, VALUE, RESULT, INNER_VALUE, INNER_RESULT>;

    constructor(middleware: InnerMiddleware<CONTEXT, VALUE, RESULT, INNER_VALUE, INNER_RESULT>) {
        this.middleware = middleware;
    }

    run = async (context: CONTEXT, value: VALUE) => {
        const next = (value: INNER_VALUE) => {
            return this.pipeline.run(context, value);
        };
        return this.middleware(context, value, next);
    }
}
