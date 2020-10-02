import * as request from 'supertest';

import Sierra, { Controller, route, Context } from '../Sierra';

describe('route decorator', () => {
    let application: Sierra;

    beforeAll(async () => {
        class TestController extends Controller {
            @route('get')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        application.init();
    });

    it('should generate get routes', async () => {
        await request(application.createServer())
            .get('/test')
            .expect(200);
    });
});