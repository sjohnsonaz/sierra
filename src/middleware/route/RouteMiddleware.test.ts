import * as request from 'supertest';

import Sierra, { BodyMiddleware, Controller } from "../../Sierra";
import { method } from "../../utils/Decorators";

describe('RouteMiddleware', () => {
    describe('argument mapping', () => {
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

                @method('post')
                async testBody($body: { id: number }) {
                    const { id } = $body;
                    return {
                        id
                    };
                }
            }
            application.use(BodyMiddleware.handle);
            application.addController(new IndexController());
            await application.init();
        });

        it('should use query params', async () => {
            await request(application.createServer())
                .get('/testQuery')
                .query({ id: 1 })
                .expect(200, { id: 1 });
        });

        it('should use route params', async () => {
            await request(application.createServer())
                .get(`/testParams/${2}`)
                .expect(200, { id: 2 });
        });

        it('should use body params', async () => {
            await request(application.createServer())
                .post('/testBody')
                .send({ id: 3 })
                .expect(200, { id: 3 });
        });
    });

    describe('argument casting', () => {
        let application: Sierra;

        beforeAll(async () => {
            application = new Sierra();

            class IndexController extends Controller {
                @method('get')
                async testQuery(boolean: boolean, number: number, string: string) {
                    return {
                        boolean: typeof boolean,
                        number: typeof number,
                        string: typeof string,
                        numberIsNan: isNaN(number),
                        stringIsEmpty: string === ''
                    };
                }

                @method('get', '/testParams/:boolean/:number/:string')
                async testParams(boolean: boolean, number: number, string: string) {
                    return {
                        boolean: typeof boolean,
                        number: typeof number,
                        string: typeof string,
                        numberIsNan: isNaN(number),
                        stringIsEmpty: string === ''
                    };
                }

                // @method('post')
                // async testBody($body: { id: number }) {
                //     const { id } = $body;
                //     return {
                //         id
                //     };
                // }
            }
            application.use(BodyMiddleware.handle);
            application.addController(new IndexController());
            await application.init();
        });

        it('should cast query params', async () => {
            await request(application.createServer())
                .get('/testQuery')
                .query({})
                .expect(200, {
                    boolean: 'boolean',
                    number: 'number',
                    string: 'string',
                    numberIsNan: true,
                    stringIsEmpty: true
                });
        });

        it('should cast route params', async () => {
            await request(application.createServer())
                .get(`/testParams////`)
                .query({ id: '1' })
                .expect(200, {
                    boolean: 'boolean',
                    number: 'number',
                    string: 'string',
                    numberIsNan: true,
                    stringIsEmpty: true
                });
        });
    });
});