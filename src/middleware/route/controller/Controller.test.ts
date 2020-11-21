import * as path from 'path';

import * as request from 'supertest';

import { Application } from '../../../Application';
import { Context } from '../../../server';
import { BodyMiddleware } from '../../body';
import { QueryStringMiddleware } from '../../query-string';

import { Controller } from './Controller';
import { method } from './Decorators';

describe('Controller', function () {
    describe('getName', function () {
        it('should return name for Controllers ending in Service', function () {
            class HomeService extends Controller {
            }
            let base = Controller.getName(new HomeService());
            expect(base).toBe('home');
        });

        it('should return name for Controllers ending in Controller', function () {
            class HomeController extends Controller {
            }
            let base = Controller.getName(new HomeController());
            expect(base).toBe('home');
        });

        it('should return name for Controllers ending in Router', function () {
            class HomeRouter extends Controller {
            }
            let base = Controller.getName(new HomeRouter());
            expect(base).toBe('home');
        });


        it('should return full name for Controllers not matching pattern', function () {
            class ExampleHandler extends Controller {
            }
            let base = Controller.getName(new ExampleHandler());
            expect(base).toBe('examplehandler');
        });

        it('should return empty string for Controllers with no name', function () {
            let base = Controller.getName(new (class extends Controller { }));
            expect(base).toBe('');
        });

        it('should return empty string for Controllers with the name Controller', function () {
            let base = Controller.getName(new Controller());
            expect(base).toBe('');
        });
    });

    describe('getBase', function () {
        it('should return "" for Controllers starting with Home', function () {
            class HomeService extends Controller {
            }
            let base = Controller.getBase(new HomeService());
            expect(base).toBe('');

            class HomeController extends Controller {
            }
            base = Controller.getBase(new HomeController());
            expect(base).toBe('');

            class HomeRouter extends Controller {
            }
            base = Controller.getBase(new HomeRouter());
            expect(base).toBe('');
        });

        it('should return "" for Controllers starting with Index', function () {
            class IndexService extends Controller {
            }
            let base = Controller.getBase(new IndexService());
            expect(base).toBe('');

            class IndexController extends Controller {
            }
            base = Controller.getBase(new IndexController());
            expect(base).toBe('');

            class IndexRouter extends Controller {
            }
            base = Controller.getBase(new IndexRouter());
            expect(base).toBe('');
        });
    });

    describe('getTemplate', function () {
        it('should return the Controller name with a method name', function () {
            class HomeController extends Controller {
                @method('get')
                async getData() {

                }
            }
            const template = Controller.getTemplate(new HomeController(), 'getData');
            expect(template).toBe(path.join('home', 'getData'));
        });

        it('should return theIndex Controller name with a method name', function () {
            class IndexController extends Controller {
                @method('get')
                async getData() {

                }
            }
            const template = Controller.getTemplate(new IndexController(), 'getData');
            expect(template).toBe(path.join('index', 'getData'));
        });
    });

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

    describe('route matching', function () {
        let application: Application;

        beforeAll(async () => {
            application = new Application();

            class IndexController extends Controller {
                @method('get')
                async get() {
                    return true;
                }
            }

            application.addController(new IndexController());
            await application.init();
        });

        it('should return "no route found" if no route is found', async () => {
            await request(application.server)
                .get('/notfound')
                .expect(404, JSON.stringify('no route found'));
        });
    });

    describe.skip('argument mapping', () => {
        let application: Application;

        beforeAll(async () => {
            application = new Application();

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
            application.use(QueryStringMiddleware);
            application.use(BodyMiddleware);
            application.addController(new IndexController());
            await application.init();
        });

        it('should use query params', async () => {
            await request(application.server)
                .get('/testQuery')
                .query({ id: 1 })
                .expect(200, { id: 1 });
        });

        it('should use route params', async () => {
            await request(application.server)
                .get(`/testParams/${2}`)
                .expect(200, { id: 2 });
        });

        it('should use body params', async () => {
            await request(application.server)
                .post('/testBody')
                .send({ id: 3 })
                .expect(200, { id: 3 });
        });
    });
});
