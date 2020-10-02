import * as request from 'supertest';

import Sierra, { Controller, route, Context } from '../../Sierra';

describe('Default route', () => {
    let application: Sierra;

    beforeAll(async function () {
        class TestController extends Controller {
            constructor() {
                super('/');
            }

            @route('get')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        application.init();
    });

    it('should use default route', async function () {
        await request(application.createServer())
            .get('/')
            .expect(200);
    });
});