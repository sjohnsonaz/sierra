import fetch from 'node-fetch';

import Sierra, { Controller, route, Context, middleware } from '../../Sierra';

describe('middleware decorator', () => {
    const port = 3001;
    const url = `http://localhost:${port}`;
    let application: Sierra = undefined;

    beforeEach(async () => {
        class TestController extends Controller {
            @middleware(async (_context) => {
                return false;
            })
            @middleware(async (_context) => {
                return true;
            })
            @route('get')
            async get(_context: Context, value: boolean) {
                return { value: value };
            }

            @middleware(async (_context) => {
                return { a: 1 };
            })
            @middleware(async (_context, value: any) => {
                value.b = 2;
                return value;
            })
            @route('post')
            async post(_context: Context, value: any) {
                return value;
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        application.init();
        await application.listen(port);
    });

    afterEach(async () => {
        await application.close();
    });

    it('should run in order', async () => {
        const response = await fetch(`${url}/test`);
        const result = await response.json();
        expect(result).toBeInstanceOf(Object);
        expect(result.value).toBe(true);
    });

    it('should run all middlewares', async () => {
        const response = await fetch(`${url}/test`, { method: 'post' });
        const result = await response.json();
        expect(result).toBeInstanceOf(Object);
        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
    });
});