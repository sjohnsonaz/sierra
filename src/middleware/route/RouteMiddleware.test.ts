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
                        boolean,
                        number,
                        string,
                        booleanType: typeof boolean,
                        numberType: typeof number,
                        stringType: typeof string,
                        numberIsNan: isNaN(number),
                        stringIsUndefined: string === undefined
                    };
                }

                @method('get', '/testParams/:boolean/:number/:string')
                async testParams(boolean: boolean, number: number, string: string) {
                    return {
                        boolean,
                        number,
                        string,
                        booleanType: typeof boolean,
                        numberType: typeof number,
                        stringType: typeof string,
                        numberIsNan: isNaN(number),
                        stringIsUndefined: string === undefined
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
            const { body } = await request(application.createServer())
                .get('/testQuery')
                .query({
                    boolean: true,
                    number: 1,
                    string: 'test'
                })
                .expect(200);
            expect(body.boolean).toBe(true);
            expect(body.number).toBe(1);
            expect(body.string).toBe('test');
            expect(body.booleanType).toBe('boolean');
            expect(body.numberType).toBe('number');
            expect(body.stringType).toBe('string');
            expect(body.numberIsNan).toBe(false);
            expect(body.stringIsUndefined).toBe(false);
        });

        it('should cast empty query params', async () => {
            const { body } = await request(application.createServer())
                .get('/testQuery')
                .query({})
                .expect(200);
            expect(body.boolean).toBe(false);
            expect(body.number).toBe(null);
            expect(body.string).toBe(undefined);
            expect(body.booleanType).toBe('boolean');
            expect(body.numberType).toBe('number');
            expect(body.stringType).toBe('undefined');
            expect(body.numberIsNan).toBe(true);
            expect(body.stringIsUndefined).toBe(true);
        });

        it('should cast route params', async () => {
            const { body } = await request(application.createServer())
                .get(`/testParams/true/1/test/`)
                .expect(200);
            expect(body.boolean).toBe(true);
            expect(body.number).toBe(1);
            expect(body.string).toBe('test');
            expect(body.booleanType).toBe('boolean');
            expect(body.numberType).toBe('number');
            expect(body.stringType).toBe('string');
            expect(body.numberIsNan).toBe(false);
            expect(body.stringIsUndefined).toBe(false);
        });

        it('should cast empty route params', async () => {
            const { body } = await request(application.createServer())
                .get(`/testParams////`)
                .expect(200);
            expect(body.boolean).toBe(false);
            expect(body.number).toBe(null);
            expect(body.string).toBe(undefined);
            expect(body.booleanType).toBe('boolean');
            expect(body.numberType).toBe('number');
            expect(body.stringType).toBe('undefined');
            expect(body.numberIsNan).toBe(true);
            expect(body.stringIsUndefined).toBe(true);
        });
    });
});