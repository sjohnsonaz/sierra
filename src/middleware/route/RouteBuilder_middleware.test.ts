import * as request from 'supertest';

import Sierra, { Controller, route, Context, middleware } from '../../Sierra';

describe('middleware decorator', () => {
    let application: Sierra = undefined;

    beforeAll(async () => {
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
    });

    it('should run in order', async () => {
        await request(application.createServer())
            .get('/test')
            .expect(200, { value: true });
    });

    it('should run all middlewares', async () => {
        await request(application.createServer())
            .post('/test')
            .expect(200, {
                a: 1,
                b: 2
            });
    });
});