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
        describe('boolean', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get')
                    async testBoolean(boolean: boolean) {
                        return {
                            boolean,
                            booleanType: typeof boolean
                        };
                    }
                }
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast boolean query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testBoolean')
                    .query({
                        boolean: true
                    })
                    .expect(200);
                expect(body.boolean).toBe(true);
                expect(body.booleanType).toBe('boolean');
            });

            it('should cast empty boolean query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testBoolean')
                    .query({})
                    .expect(200);
                expect(body.boolean).toBe(false);
                expect(body.booleanType).toBe('boolean');
            });
        });

        describe('number', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get')
                    async testNumber(number: number) {
                        return {
                            number,
                            numberType: typeof number,
                            numberIsNan: isNaN(number)
                        };
                    }
                }
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast number query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testNumber')
                    .query({
                        number: 1
                    })
                    .expect(200);
                expect(body.number).toBe(1);
                expect(body.numberType).toBe('number');
                expect(body.numberIsNan).toBe(false);
            });

            it('should cast empty number query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testNumber')
                    .query({})
                    .expect(200);
                expect(body.number).toBe(null);
                expect(body.numberType).toBe('number');
                expect(body.numberIsNan).toBe(true);
            });
        });

        describe('string', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get')
                    async testString(string: string) {
                        return {
                            string,
                            stringType: typeof string,
                            stringIsUndefined: string === undefined
                        };
                    }
                }
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast string query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testString')
                    .query({
                        string: 'test'
                    })
                    .expect(200);
                expect(body.string).toBe('test');
                expect(body.stringType).toBe('string');
                expect(body.stringIsUndefined).toBe(false);
            });

            it('should cast empty string query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testString')
                    .query({})
                    .expect(200);
                expect(body.string).toBe(undefined);
                expect(body.stringType).toBe('undefined');
                expect(body.stringIsUndefined).toBe(true);
            });
        });

        describe('array', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get')
                    async testArray(array: number[]) {
                        return {
                            array
                        };
                    }
                }
                application.addController(new IndexController());
                await application.init();
            });

            it.skip('should cast query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testArray')
                    .query({
                        'array': [1, 2, 3]
                    })
                    .expect(200);
                expect(body['array']).toStrictEqual([1, 2, 3]);
            });

            it.skip('should cast empty query params', async () => {
                const { body } = await request(application.createServer())
                    .get('/testArray')
                    .query({})
                    .expect(200);
                expect(body['array']).toStrictEqual([]);
            });
        });
    });

    describe('route param casting', () => {
        describe('boolean', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get', '/testBoolean/:boolean')
                    async testBoolean(boolean: boolean) {
                        return {
                            boolean,
                            booleanType: typeof boolean
                        };
                    }
                }
                application.use(BodyMiddleware.handle);
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast route params', async () => {
                const { body } = await request(application.createServer())
                    .get(`/testBoolean/true`)
                    .expect(200);
                expect(body.boolean).toBe(true);
                expect(body.booleanType).toBe('boolean');
            });

            it('should cast empty route params', async () => {
                const { body } = await request(application.createServer())
                    .get(`/testBoolean//`)
                    .expect(200);
                expect(body.boolean).toBe(false);
                expect(body.booleanType).toBe('boolean');
            });
        });

        describe('number', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get', '/testNumber/:number')
                    async testNumber(number: number) {
                        return {
                            number,
                            numberType: typeof number,
                            numberIsNan: isNaN(number)
                        };
                    }
                }
                application.use(BodyMiddleware.handle);
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast route params', async () => {
                const { body } = await request(application.createServer())
                    .get(`/testNumber/1`)
                    .expect(200);
                expect(body.number).toBe(1);
                expect(body.numberType).toBe('number');
                expect(body.numberIsNan).toBe(false);
            });

            it('should cast empty route params', async () => {
                const { body } = await request(application.createServer())
                    .get(`/testNumber//`)
                    .expect(200);
                expect(body.number).toBe(null);
                expect(body.numberType).toBe('number');
                expect(body.numberIsNan).toBe(true);
            });
        });

        describe('string', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();

                class IndexController extends Controller {
                    @method('get', '/testString/:string')
                    async testString(string: string) {
                        return {
                            string,
                            stringType: typeof string,
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
                    .get(`/testString/test`)
                    .expect(200);
                expect(body.string).toBe('test');
                expect(body.stringType).toBe('string');
                expect(body.stringIsUndefined).toBe(false);
            });

            it('should cast empty route params', async () => {
                const { body } = await request(application.createServer())
                    .get(`/testString//`)
                    .expect(200);
                expect(body.string).toBe(undefined);
                expect(body.stringType).toBe('undefined');
                expect(body.stringIsUndefined).toBe(true);
            });
        });
    });

    describe('body param casting', () => {
        describe('boolean', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();
                class IndexController extends Controller {
                    @method('post')
                    async testBoolean(boolean: boolean) {
                        return {
                            boolean,
                            booleanType: typeof boolean
                        };
                    }
                }
                application.use(BodyMiddleware.handle);
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testBoolean`)
                    .send({
                        boolean: true
                    })
                    .expect(200);
                expect(body.boolean).toBe(true);
                expect(body.booleanType).toBe('boolean');
            });

            it('should cast empty body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testBoolean`)
                    .expect(200);
                expect(body.boolean).toBe(false);
                expect(body.booleanType).toBe('boolean');
            });
        });

        describe('number', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();
                class IndexController extends Controller {
                    @method('post')
                    async testNumber(number: number) {
                        return {
                            number,
                            numberType: typeof number,
                            numberIsNan: isNaN(number)
                        };
                    }
                }
                application.use(BodyMiddleware.handle);
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testNumber`)
                    .send({
                        number: 1
                    })
                    .expect(200);
                expect(body.number).toBe(1);
                expect(body.numberType).toBe('number');
                expect(body.numberIsNan).toBe(false);
            });

            it('should cast empty body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testNumber`)
                    .expect(200);
                expect(body.number).toBe(null);
                expect(body.numberType).toBe('number');
                expect(body.numberIsNan).toBe(true);
            });
        });

        describe('string', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();
                class IndexController extends Controller {
                    @method('post')
                    async testString(string: string) {
                        return {
                            string,
                            stringType: typeof string,
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
                    .post(`/testString`)
                    .send({
                        string: 'test'
                    })
                    .expect(200);
                expect(body.string).toBe('test');
                expect(body.stringType).toBe('string');
                expect(body.stringIsUndefined).toBe(false);
            });

            it('should cast empty body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testString`)
                    .expect(200);
                expect(body.string).toBe(undefined);
                expect(body.stringType).toBe('undefined');
                expect(body.stringIsUndefined).toBe(true);
            });
        });
        describe('array', function () {
            let application: Sierra;

            beforeAll(async () => {
                application = new Sierra();
                class IndexController extends Controller {
                    @method('post')
                    async testArray(array: number[]) {
                        return {
                            array
                        };
                    }
                }
                application.use(BodyMiddleware.handle);
                application.addController(new IndexController());
                await application.init();
            });

            it('should cast body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testArray`)
                    .send({
                        array: [1, 2, 3]
                    })
                    .expect(200);
                expect(body.array).toStrictEqual([1, 2, 3]);
            });

            it('should cast empty body params', async () => {
                const { body } = await request(application.createServer())
                    .post(`/testArray`)
                    .expect(200);
                expect(body.array).toBeUndefined();
            });
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

                constructor(boolean: boolean, number: number, string: string) {
                    this.boolean = boolean;
                    this.number = number;
                    this.string = string;
                }
            }

            application.routeMiddleware.addFactory(BodyObject, ({
                boolean,
                number,
                string
            }: {
                boolean: boolean;
                number: number;
                string: string;
            }) => {
                return new BodyObject(boolean, number, string);
            });

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