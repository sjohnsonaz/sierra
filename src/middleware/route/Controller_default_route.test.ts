import * as request from 'supertest';

import { Application } from '../../Application';
import { Context } from '../../server';

import { Controller } from './Controller';
import { route } from './Decorators';

describe('Default route', () => {
    let application: Application;

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

        application = new Application();
        application.addController(new TestController());
        application.init();
    });

    it('should use default route', async function () {
        await request(application.createServer())
            .get('/')
            .expect(200);
    });
});