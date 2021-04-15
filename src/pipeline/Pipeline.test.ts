import { Pipeline } from './Pipeline';
import { exit, PipelineExit } from './Pipeline';

describe('Pipeline', function () {
    describe('run', function () {
        it('should run middleware', async function () {
            let pipeline = new Pipeline().use(async () => {
                return true;
            });
            // TODO: Fix optional parameters
            let result = await pipeline.run({}, undefined);
            expect(result).toBe(true);
        });

        it('should run middleware in order', async function () {
            let pipeline = new Pipeline<{}, string, string>()
                .use(
                    async (_context, value: string): Promise<string> => {
                        return value + 'b';
                    }
                )
                .use(async (_context, value: string) => {
                    return value + 'c';
                });
            let result = await pipeline.run({}, 'a');
            expect(result).toBe('abc');
        });

        it('should throw exceptions', async function () {
            let pipeline = new Pipeline<any, string, string>();
            pipeline.use(async (context, value) => {
                throw 'exception';
            });
            pipeline.use(async (context, value) => {
                return 'success';
            });
            let result: string;
            try {
                result = await pipeline.run({}, 'a');
            } catch (e) {
                result = e;
            }
            expect(result).toBe('exception');
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

describe('PipelineExit', function () {
    describe('exit', function () {
        it('should create a new PipelineExit', function () {
            const pipelineExit = exit();
            expect(pipelineExit).toBeInstanceOf(PipelineExit);
        });
    });
});
