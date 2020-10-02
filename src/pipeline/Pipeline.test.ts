import { Pipeline } from '../Sierra';

describe('Pipeline', function () {
    it('should run middleware', async function () {
        let pipeline = new Pipeline();
        pipeline.use(async () => {
            return true;
        });
        let result = await pipeline.run({});
        expect(result).toBe(true);
    });

    it('should run middleware in order', async function () {
        let pipeline = new Pipeline<any, string, string>();
        pipeline.use(async (context, value: string) => {
            return value + 'b';
        });
        pipeline.use(async (context, value: string) => {
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
        }
        catch (e) {
            result = e;
        }
        expect(result).toBe('exception');
    })
});