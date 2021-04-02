import { Middleware, MiddlewareReturn } from './Middleware';
import { pipeline, Pipeline } from './Pipeline';

describe('Pipeline', function () {
    describe('run', function () {
        it('should run middleware', async function () {
            let testPipeline = pipeline().use(async () => {
                return true;
            });
            let result = await testPipeline.run({});
            expect(result.value).toBe(true);
        });

        it('should run middleware in order', async function () {
            let testPipeline = pipeline()
                .use(async (context: { value: string }) => {
                    context.value += 'b';
                })
                .use(async (context) => {
                    return context.value + 'c';
                });
            let result = await testPipeline.run({ value: 'a' });
            expect(result.value).toBe('abc');
        });

        it('should throw exceptions', async function () {
            let testPipeline = pipeline()
                .use(async (context: string) => {
                    throw 'exception';
                })
                .use(async (context: string) => {
                    return 'success';
                });
            expect(async () => {
                await testPipeline.run('a');
            }).rejects.toMatch('exception');
        });
    });

    describe('use', function () {
        it('should add middleware', function () {
            const pipeline = new Pipeline();
            const middleware = async () => {};
            pipeline.use(middleware);
            expect(pipeline.middlewares.length).toBe(1);
            expect(pipeline.middlewares[0]).toBe(middleware);
        });
    });

    describe('remove', function () {
        it('should remove middleware', function () {
            const pipeline = new Pipeline();
            const middleware = async () => {};
            pipeline.use(middleware);
            pipeline.remove(middleware);
            expect(pipeline.middlewares.length).toBe(0);
        });

        it('should handle non-contained middleware', function () {
            const pipeline = new Pipeline();
            const middleware = async () => {};
            pipeline.remove(middleware);
            expect(pipeline.middlewares.length).toBe(0);
        });
    });
});

const testPipeiline = new Pipeline();
const newTest = testPipeiline
    .use<{ value: string }, boolean>(async (context) => {
        return true;
    })
    .use(async (context: { test: string }) => {})
    .use<{ name: string }>(async (context) => {})
    .use(async (context) => {
        context.test;
        return true;
    });

const middleware = async () => true;

type middlewareReturn = MiddlewareReturn<typeof middleware>;

function use<T extends Middleware<any, any>>(middleware: T) {
    const value: MiddlewareReturn<typeof middleware> = undefined as any;
    return value;
}

const value = use(middleware);
