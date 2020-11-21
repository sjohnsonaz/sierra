import * as request from 'supertest';

import { Application } from '../../Application';
import { Context } from '../../server';

import { Controller } from './Controller';
import { method } from './Decorators';

// TODO: Enable default route
describe.skip('Default route', () => {
    let application: Application;

    beforeAll(async function () {
        class TestController extends Controller {
            constructor() {
                super('/');
            }

            @method('get')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        application = new Application();
        application.addController(new TestController());
        await application.init();
    });

    it('should use default route', async function () {
        await request(application.server)
            .get('/')
            .expect(200);
    });
});