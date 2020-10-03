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
                async testBody(id: number) {
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

    describe('query param casting', () => {
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
            }
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
    });

    describe('route param casting', () => {
        let application: Sierra;

        beforeAll(async () => {
            application = new Sierra();

            class IndexController extends Controller {
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
            }
            application.use(BodyMiddleware.handle);
            application.addController(new IndexController());
            await application.init();
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

    describe('body param casting', () => {
        let application: Sierra;

        beforeAll(async () => {
            application = new Sierra();
            class IndexController extends Controller {
                @method('post')
                async testBody(boolean: boolean, number: number, string: string) {
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
            }
            application.use(BodyMiddleware.handle);
            application.addController(new IndexController());
            await application.init();
        });

        it('should cast body params', async () => {
            const { body } = await request(application.createServer())
                .post(`/testBody`)
                .send({
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

        it('should cast empty body params', async () => {
            const { body } = await request(application.createServer())
                .post(`/testBody`)
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

    describe('body object param casting', () => {
        let application: Sierra;

        beforeAll(async () => {
            application = new Sierra();

            class BodyObject {
                boolean: boolean;
                number: number;
                string: string;

                constructor(
                    {
                        boolean,
                        number,
                        string
                    }: {
                        boolean: boolean;
                        number: number;
                        string: string;
                    }
                ) {
                    this.boolean = boolean;
                    this.number = number;
                    this.string = string;
                }
            }

            class IndexController extends Controller {
                @method('post')
                async testBodyObject($body: BodyObject) {
                    const { boolean, number, string } = $body;
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
            }
            application.use(BodyMiddleware.handle);
            application.addController(new IndexController());
            await application.init();
        });

        it('should cast body Object params', async () => {
            const { body } = await request(application.createServer())
                .post(`/testBodyObject`)
                .send({
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

        it('should cast empty body Object params', async () => {
            const { body } = await request(application.createServer())
                .post(`/testBodyObject`)
                .expect(200);
            expect(body.boolean).toBe(undefined);
            expect(body.number).toBe(undefined);
            expect(body.string).toBe(undefined);
            expect(body.booleanType).toBe('undefined');
            expect(body.numberType).toBe('undefined');
            expect(body.stringType).toBe('undefined');
            expect(body.numberIsNan).toBe(true);
            expect(body.stringIsUndefined).toBe(true);
        });
    });
});