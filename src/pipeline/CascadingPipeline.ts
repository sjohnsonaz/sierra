type NextMiddleware<CONTEXT, VALUE, RESULT, NEXT_VALUE, NEXT_RESULT> =
    (context: CONTEXT, value: VALUE, next: Next<NEXT_VALUE, NEXT_RESULT>) => Promise<RESULT>;

type Next<NEXT_VALUE, NEXT_RESULT> =
    (value: NEXT_VALUE) => Promise<NEXT_RESULT>;

class CascadingPipeline<CONTEXT> {
    middleware: NextMiddleware<CONTEXT, any, any, any, any>[] = [];
    async run(context: CONTEXT, value: any): Promise<any> {
        const generator = createGenerator(context, value, this.middleware, async function (value: any): Promise<any> {
            const result = generator.next(value);
            return await result.value
        });
    }
}

function* createGenerator<CONTEXT, VALUE>(context: CONTEXT, value: VALUE, middleware: NextMiddleware<CONTEXT, any, any, any, any>[], next: Next<any, any>) {
    let result: any = value;
    for (let _middleware of middleware) {
        result = yield _middleware(context, result, next)
    }
    return result;
}
