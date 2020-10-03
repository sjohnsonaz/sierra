import * as request from 'supertest';

import Sierra, { Controller } from "../../Sierra";
import { method } from "../../utils/Decorators";

describe('RouteMiddleware', () => {
    let application: Sierra;

    beforeAll(async () => {
        application = new Sierra();

        class IndexController extends Controller {
            @method('get')
            async testQuery(id: number) {
                return {
                    id
                };
            }

            @method('get', '/testParams/:id')
            async testParams(id: number) {
                return {
                    id
                };
            }
        }

        application.addController(new IndexController());
        await application.init();
    });

    it('should route params', async () => {
        await request(application.createServer())
            .get('/testQuery')
            .query({ id: 1 })
            .expect(200, { id: 1 });
    });

    it('should route params', async () => {
        await request(application.createServer())
            .get(`/testParams/${2}`)
            .expect(200, { id: 2 });
    });
});