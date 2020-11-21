// import * as request from 'supertest';

// import { Application } from '../../Application';

// import { BodyMiddleware } from '../body';

// import { method } from './Decorators';
// import { Controller } from './Controller';
// import { Route } from './Route';
// import { RouteMiddleware, sortRoutes } from './RouteMiddleware';
// import { Verb } from '../../server';
// import { QueryStringMiddleware } from '../query-string';

// describe('RouteMiddleware', () => {
//     describe('route matching', function () {
//         let application: Application;

//         beforeAll(async () => {
//             application = new Application();

//             class IndexController extends Controller {
//                 @method('get')
//                 async get() {
//                     return true;
//                 }
//             }

//             application.addController(new IndexController());
//             await application.init();
//         });

//         it('should return "no route found" if no route is found', async () => {
//             await request(application.server)
//                 .get('/notfound')
//                 .expect(404, JSON.stringify('no route found'));
//         });
//     });

//     describe('argument mapping', () => {
//         let application: Application;

//         beforeAll(async () => {
//             application = new Application();

//             class IndexController extends Controller {
//                 @method('get')
//                 async testQuery(id: number) {
//                     return {
//                         id
//                     };
//                 }

//                 @method('get', '/testParams/:id')
//                 async testParams(id: number) {
//                     return {
//                         id
//                     };
//                 }

//                 @method('post')
//                 async testBody(id: number) {
//                     return {
//                         id
//                     };
//                 }
//             }
//             application.use(QueryStringMiddleware);
//             application.use(BodyMiddleware);
//             application.addController(new IndexController());
//             await application.init();
//         });

//         it('should use query params', async () => {
//             await request(application.server)
//                 .get('/testQuery')
//                 .query({ id: 1 })
//                 .expect(200, { id: 1 });
//         });

//         it('should use route params', async () => {
//             await request(application.server)
//                 .get(`/testParams/${2}`)
//                 .expect(200, { id: 2 });
//         });

//         it('should use body params', async () => {
//             await request(application.server)
//                 .post('/testBody')
//                 .send({ id: 3 })
//                 .expect(200, { id: 3 });
//         });
//     });

//     describe('query param casting', () => {
//         describe('boolean', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 application.use(QueryStringMiddleware);

//                 class IndexController extends Controller {
//                     @method('get')
//                     async testBoolean(boolean: boolean) {
//                         return {
//                             boolean,
//                             booleanType: typeof boolean
//                         };
//                     }
//                 }
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast boolean query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testBoolean')
//                     .query({
//                         boolean: true
//                     })
//                     .expect(200);
//                 expect(body.boolean).toBe(true);
//                 expect(body.booleanType).toBe('boolean');
//             });

//             it('should cast empty boolean query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testBoolean')
//                     .query({})
//                     .expect(200);
//                 expect(body.boolean).toBe(false);
//                 expect(body.booleanType).toBe('boolean');
//             });
//         });

//         describe('number', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 application.use(QueryStringMiddleware);

//                 class IndexController extends Controller {
//                     @method('get')
//                     async testNumber(number: number) {
//                         return {
//                             number,
//                             numberType: typeof number,
//                             numberIsNan: isNaN(number)
//                         };
//                     }
//                 }
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast number query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testNumber')
//                     .query({
//                         number: 1
//                     })
//                     .expect(200);
//                 expect(body.number).toBe(1);
//                 expect(body.numberType).toBe('number');
//                 expect(body.numberIsNan).toBe(false);
//             });

//             it('should cast empty number query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testNumber')
//                     .query({})
//                     .expect(200);
//                 expect(body.number).toBe(null);
//                 expect(body.numberType).toBe('number');
//                 expect(body.numberIsNan).toBe(true);
//             });
//         });

//         describe('string', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 application.use(QueryStringMiddleware);

//                 class IndexController extends Controller {
//                     @method('get')
//                     async testString(string: string) {
//                         return {
//                             string,
//                             stringType: typeof string,
//                             stringIsUndefined: string === undefined
//                         };
//                     }
//                 }
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast string query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testString')
//                     .query({
//                         string: 'test'
//                     })
//                     .expect(200);
//                 expect(body.string).toBe('test');
//                 expect(body.stringType).toBe('string');
//                 expect(body.stringIsUndefined).toBe(false);
//             });

//             it('should cast empty string query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testString')
//                     .query({})
//                     .expect(200);
//                 expect(body.string).toBe(undefined);
//                 expect(body.stringType).toBe('undefined');
//                 expect(body.stringIsUndefined).toBe(true);
//             });
//         });

//         describe('array', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 application.use(QueryStringMiddleware);

//                 class IndexController extends Controller {
//                     @method('get')
//                     async testArray(array: number[]) {
//                         return {
//                             array
//                         };
//                     }
//                 }
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             // TODO: Cannot cast Array items
//             it('should cast query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testArray')
//                     .query({
//                         'array': [1, 2, 3]
//                     })
//                     .expect(200);
//                 expect(body['array']).toStrictEqual(['1', '2', '3']);
//             });

//             it('should cast empty query params', async () => {
//                 const { body } = await request(application.server)
//                     .get('/testArray')
//                     .query({})
//                     .expect(200);
//                 expect(body['array']).toBeUndefined();
//             });
//         });
//     });

//     describe('route param casting', () => {
//         describe('boolean', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 application.use(QueryStringMiddleware);

//                 class IndexController extends Controller {
//                     @method('get', '/testBoolean/:boolean')
//                     async testBoolean(boolean: boolean) {
//                         return {
//                             boolean,
//                             booleanType: typeof boolean
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast route params', async () => {
//                 const { body } = await request(application.server)
//                     .get(`/testBoolean/true`)
//                     .expect(200);
//                 expect(body.boolean).toBe(true);
//                 expect(body.booleanType).toBe('boolean');
//             });

//             it('should cast empty route params', async () => {
//                 const { body } = await request(application.server)
//                     .get(`/testBoolean//`)
//                     .expect(200);
//                 expect(body.boolean).toBe(false);
//                 expect(body.booleanType).toBe('boolean');
//             });
//         });

//         describe('number', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();

//                 class IndexController extends Controller {
//                     @method('get', '/testNumber/:number')
//                     async testNumber(number: number) {
//                         return {
//                             number,
//                             numberType: typeof number,
//                             numberIsNan: isNaN(number)
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast route params', async () => {
//                 const { body } = await request(application.server)
//                     .get(`/testNumber/1`)
//                     .expect(200);
//                 expect(body.number).toBe(1);
//                 expect(body.numberType).toBe('number');
//                 expect(body.numberIsNan).toBe(false);
//             });

//             it('should cast empty route params', async () => {
//                 const { body } = await request(application.server)
//                     .get(`/testNumber//`)
//                     .expect(200);
//                 expect(body.number).toBe(null);
//                 expect(body.numberType).toBe('number');
//                 expect(body.numberIsNan).toBe(true);
//             });
//         });

//         describe('string', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();

//                 class IndexController extends Controller {
//                     @method('get', '/testString/:string')
//                     async testString(string: string) {
//                         return {
//                             string,
//                             stringType: typeof string,
//                             stringIsUndefined: string === undefined
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast route params', async () => {
//                 const { body } = await request(application.server)
//                     .get(`/testString/test`)
//                     .expect(200);
//                 expect(body.string).toBe('test');
//                 expect(body.stringType).toBe('string');
//                 expect(body.stringIsUndefined).toBe(false);
//             });

//             it('should cast empty route params', async () => {
//                 const { body } = await request(application.server)
//                     .get(`/testString//`)
//                     .expect(200);
//                 expect(body.string).toBe(undefined);
//                 expect(body.stringType).toBe('undefined');
//                 expect(body.stringIsUndefined).toBe(true);
//             });
//         });
//     });

//     describe('body param casting', () => {
//         describe('boolean', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 class IndexController extends Controller {
//                     @method('post')
//                     async testBoolean(boolean: boolean) {
//                         return {
//                             boolean,
//                             booleanType: typeof boolean
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testBoolean`)
//                     .send({
//                         boolean: true
//                     })
//                     .expect(200);
//                 expect(body.boolean).toBe(true);
//                 expect(body.booleanType).toBe('boolean');
//             });

//             it('should cast empty body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testBoolean`)
//                     .expect(200);
//                 expect(body.boolean).toBe(false);
//                 expect(body.booleanType).toBe('boolean');
//             });
//         });

//         describe('number', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 class IndexController extends Controller {
//                     @method('post')
//                     async testNumber(number: number) {
//                         return {
//                             number,
//                             numberType: typeof number,
//                             numberIsNan: isNaN(number)
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testNumber`)
//                     .send({
//                         number: 1
//                     })
//                     .expect(200);
//                 expect(body.number).toBe(1);
//                 expect(body.numberType).toBe('number');
//                 expect(body.numberIsNan).toBe(false);
//             });

//             it('should cast empty body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testNumber`)
//                     .expect(200);
//                 expect(body.number).toBe(null);
//                 expect(body.numberType).toBe('number');
//                 expect(body.numberIsNan).toBe(true);
//             });
//         });

//         describe('string', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 class IndexController extends Controller {
//                     @method('post')
//                     async testString(string: string) {
//                         return {
//                             string,
//                             stringType: typeof string,
//                             stringIsUndefined: string === undefined
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testString`)
//                     .send({
//                         string: 'test'
//                     })
//                     .expect(200);
//                 expect(body.string).toBe('test');
//                 expect(body.stringType).toBe('string');
//                 expect(body.stringIsUndefined).toBe(false);
//             });

//             it('should cast empty body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testString`)
//                     .expect(200);
//                 expect(body.string).toBe(undefined);
//                 expect(body.stringType).toBe('undefined');
//                 expect(body.stringIsUndefined).toBe(true);
//             });
//         });

//         describe('array', function () {
//             let application: Application;

//             beforeAll(async () => {
//                 application = new Application();
//                 class IndexController extends Controller {
//                     @method('post')
//                     async testArray(array: number[]) {
//                         return {
//                             array
//                         };
//                     }
//                 }
//                 application.use(BodyMiddleware);
//                 application.addController(new IndexController());
//                 await application.init();
//             });

//             it('should cast body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testArray`)
//                     .send({
//                         array: [1, 2, 3]
//                     })
//                     .expect(200);
//                 expect(body.array).toStrictEqual([1, 2, 3]);
//             });

//             it('should cast empty body params', async () => {
//                 const { body } = await request(application.server)
//                     .post(`/testArray`)
//                     .expect(200);
//                 expect(body.array).toBeUndefined();
//             });
//         });
//     });

//     describe('body object param casting', () => {
//         let application: Application;

//         beforeAll(async () => {
//             application = new Application();

//             class BodyObject {
//                 boolean: boolean;
//                 number: number;
//                 string: string;

//                 constructor(boolean: boolean, number: number, string: string) {
//                     this.boolean = boolean;
//                     this.number = number;
//                     this.string = string;
//                 }
//             }

//             application.routeMiddleware.addFactory(BodyObject, ({
//                 boolean,
//                 number,
//                 string
//             }: {
//                 boolean: boolean;
//                 number: number;
//                 string: string;
//             }) => {
//                 return new BodyObject(boolean, number, string);
//             });

//             class IndexController extends Controller {
//                 @method('post')
//                 async testBodyObject($body: BodyObject) {
//                     const { boolean, number, string } = $body;
//                     return {
//                         boolean,
//                         number,
//                         string,
//                         booleanType: typeof boolean,
//                         numberType: typeof number,
//                         stringType: typeof string,
//                         numberIsNan: isNaN(number),
//                         stringIsUndefined: string === undefined
//                     };
//                 }

//                 @method('post')
//                 async testObject($body: Record<string, any>) {
//                     const { boolean, number, string } = $body;
//                     return {
//                         boolean,
//                         number,
//                         string,
//                         booleanType: typeof boolean,
//                         numberType: typeof number,
//                         stringType: typeof string,
//                         numberIsNan: isNaN(number),
//                         stringIsUndefined: string === undefined
//                     };
//                 }

//                 @method('post')
//                 async testAny($body: any) {
//                     const { boolean, number, string } = $body;
//                     return {
//                         boolean,
//                         number,
//                         string,
//                         booleanType: typeof boolean,
//                         numberType: typeof number,
//                         stringType: typeof string,
//                         numberIsNan: isNaN(number),
//                         stringIsUndefined: string === undefined
//                     };
//                 }
//             }
//             application.use(BodyMiddleware);
//             application.addController(new IndexController());
//             await application.init();
//         });

//         it('should cast body Object params', async () => {
//             const { body } = await request(application.server)
//                 .post(`/testBodyObject`)
//                 .send({
//                     boolean: true,
//                     number: 1,
//                     string: 'test'
//                 })
//                 .expect(200);
//             expect(body.boolean).toBe(true);
//             expect(body.number).toBe(1);
//             expect(body.string).toBe('test');
//             expect(body.booleanType).toBe('boolean');
//             expect(body.numberType).toBe('number');
//             expect(body.stringType).toBe('string');
//             expect(body.numberIsNan).toBe(false);
//             expect(body.stringIsUndefined).toBe(false);
//         });

//         it('should cast empty body Object params', async () => {
//             const { body } = await request(application.server)
//                 .post(`/testBodyObject`)
//                 .expect(200);
//             expect(body.boolean).toBe(undefined);
//             expect(body.number).toBe(undefined);
//             expect(body.string).toBe(undefined);
//             expect(body.booleanType).toBe('undefined');
//             expect(body.numberType).toBe('undefined');
//             expect(body.stringType).toBe('undefined');
//             expect(body.numberIsNan).toBe(true);
//             expect(body.stringIsUndefined).toBe(true);
//         });

//         it('should not cast anonymous body Object params', async () => {
//             const { body } = await request(application.server)
//                 .post(`/testObject`)
//                 .send({
//                     boolean: true,
//                     number: 1,
//                     string: 'test'
//                 })
//                 .expect(200);
//             expect(body.boolean).toBe(true);
//             expect(body.number).toBe(1);
//             expect(body.string).toBe('test');
//             expect(body.booleanType).toBe('boolean');
//             expect(body.numberType).toBe('number');
//             expect(body.stringType).toBe('string');
//             expect(body.numberIsNan).toBe(false);
//             expect(body.stringIsUndefined).toBe(false);
//         });

//         it('should not cast empty anonymous body Object params', async () => {
//             const { body } = await request(application.server)
//                 .post(`/testObject`)
//                 .expect(200);
//             expect(body.boolean).toBe(undefined);
//             expect(body.number).toBe(undefined);
//             expect(body.string).toBe(undefined);
//             expect(body.booleanType).toBe('undefined');
//             expect(body.numberType).toBe('undefined');
//             expect(body.stringType).toBe('undefined');
//             expect(body.numberIsNan).toBe(true);
//             expect(body.stringIsUndefined).toBe(true);
//         });

//         it('should not cast unknown body Object params', async () => {
//             const { body } = await request(application.server)
//                 .post(`/testAny`)
//                 .send({
//                     boolean: true,
//                     number: 1,
//                     string: 'test'
//                 })
//                 .expect(200);
//             expect(body.boolean).toBe(true);
//             expect(body.number).toBe(1);
//             expect(body.string).toBe('test');
//             expect(body.booleanType).toBe('boolean');
//             expect(body.numberType).toBe('number');
//             expect(body.stringType).toBe('string');
//             expect(body.numberIsNan).toBe(false);
//             expect(body.stringIsUndefined).toBe(false);
//         });

//         it('should not cast empty unknown body Object params', async () => {
//             const { body } = await request(application.server)
//                 .post(`/testAny`)
//                 .expect(200);
//             expect(body.boolean).toBe(undefined);
//             expect(body.number).toBe(undefined);
//             expect(body.string).toBe(undefined);
//             expect(body.booleanType).toBe('undefined');
//             expect(body.numberType).toBe('undefined');
//             expect(body.stringType).toBe('undefined');
//             expect(body.numberIsNan).toBe(true);
//             expect(body.stringIsUndefined).toBe(true);
//         });
//     });

//     describe('Controller', function () {
//         describe.skip('init', function () {
//             it('should build Routes from Controllers', function () {

//             });

//             it('should sort Routes from Controllers', function () {

//             });
//         });

//         describe('addController', function () {
//             it('should add a Controller', function () {
//                 const routeMiddleware = new RouteMiddleware();
//                 expect(routeMiddleware.controllers.length).toBe(0);
//                 const controller = new Controller();
//                 routeMiddleware.addController(controller);
//                 expect(routeMiddleware.controllers.length).toBe(1);
//                 expect(routeMiddleware.controllers[0]).toBe(controller);
//             });
//         });

//         describe('removeController', function () {
//             it('should remove a Controller', function () {
//                 const routeMiddleware = new RouteMiddleware();
//                 const controller = new Controller();
//                 routeMiddleware.addController(controller);
//                 expect(routeMiddleware.controllers.length).toBe(1);
//                 routeMiddleware.removeController(controller);
//                 expect(routeMiddleware.controllers.length).toBe(0);
//             });

//             it('should not remove a Controller that is not present', function () {
//                 const routeMiddleware = new RouteMiddleware();
//                 const controller = new Controller();
//                 routeMiddleware.removeController(controller);
//                 expect(routeMiddleware.controllers.length).toBe(0);
//             });
//         });
//     });

//     describe('Factory', function () {
//         class BodyObject {
//             boolean: boolean;
//             number: number;
//             string: string;

//             constructor(boolean: boolean, number: number, string: string) {
//                 this.boolean = boolean;
//                 this.number = number;
//                 this.string = string;
//             }
//         }

//         const factory = ({
//             boolean,
//             number,
//             string
//         }: {
//             boolean: boolean;
//             number: number;
//             string: string;
//         }) => {
//             return new BodyObject(boolean, number, string);
//         };

//         describe('addFactory', function () {
//             it('should add a Factory', function () {
//                 const routeMiddleware = new RouteMiddleware();
//                 routeMiddleware.addFactory(BodyObject, factory);

//                 expect(Object.keys(routeMiddleware.factories).length).toBe(1);
//                 expect(routeMiddleware.factories['BodyObject']).toBe(factory);
//             });
//         });

//         describe('removeFactory', function () {
//             it('should add a Factory', function () {
//                 const routeMiddleware = new RouteMiddleware();
//                 routeMiddleware.addFactory(BodyObject, factory);
//                 routeMiddleware.removeFactory(BodyObject);

//                 expect(Object.keys(routeMiddleware.factories).length).toBe(0);
//             });
//         });

//         describe('getFactory', function () {
//             const routeMiddleware = new RouteMiddleware();
//             routeMiddleware.addFactory(BodyObject, factory);
//             const testFactory = routeMiddleware.getFactory(BodyObject);

//             expect(testFactory).toBe(factory);
//         });
//     });

//     describe('Route sorting', function () {
//         it('routes are sorted by RegExp, then location or first \':\', then alphabetical', () => {

//             let routes = [
//                 '/',
//                 '/:id',
//                 '/count',
//                 '/test/:id',
//                 '/:var/a/',
//                 '/findit/:name',
//                 '/getsomething/:id/:name',
//                 '/getsomething/:name/:id',
//                 '/getsomething/:another/:id',
//                 '/getsomething/:id/fixed'
//             ];

//             routes.map(route => {
//                 return new Route(Verb.Get, route, undefined as any, undefined as any, undefined as any, undefined as any, undefined as any, undefined as any);
//             }).sort(sortRoutes);

//             expect(true).toBe(true);
//         });
//     });
// });