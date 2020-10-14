import { Controller } from './Controller';
import { method, middleware, route } from './Decorators';

describe('Decorators', function () {
    describe('route', function () {
        it('should generate get routes', async function () {
            class TestController extends Controller {
                @route('get')
                async get() {
                    return { value: true };
                }
            }

            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.method.verb).toBe('get');
        });

        it.skip('should generate routes for multiple verbs', async function () {
            class TestController extends Controller {
                @route(['get', 'post'])
                async get() {
                    return { value: true };
                }
            }

            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.method.verb).toBe('get');
        });

        it.skip('should generate routes for all verbs', async function () {
            class TestController extends Controller {
                @route('all')
                async get() {
                    return { value: true };
                }
            }

            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.method.verb).toBe('get');
        });
    });

    describe('method', function () {
        it('should generate get routes', async function () {
            class TestController extends Controller {
                @method('get')
                async get() {
                    return { value: true };
                }
            }

            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.method.verb).toBe('get');
        });

        it.skip('should generate routes for multiple verbs', async function () {
            class TestController extends Controller {
                @method(['get', 'post'])
                async get() {
                    return { value: true };
                }
            }

            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.method.verb).toBe('get');
        });

        it.skip('should generate routes for all verbs', async function () {
            class TestController extends Controller {
                @method('all')
                async get() {
                    return { value: true };
                }
            }

            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.method.verb).toBe('get');
        });
    });

    describe('middlware', function () {
        it('should adds a function to the middleware queue', function () {
            class TestController extends Controller {
                @method('get')
                @middleware(async function middlewareA() { })
                async get() {
                    return { value: true };
                }
            }
            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.middleware.length).toBe(1);
            expect(get.middleware[0].name).toBe('middlewareA');
        });

        it('should add functions in order', function () {
            class TestController extends Controller {
                @method('get')
                @middleware(async function middlewareA() { })
                @middleware(async function middlewareB() { })
                async get() {
                    return { value: true };
                }
            }
            const testController = new TestController()
            const definitions = testController._routeBuilder.getRouteDefinitions();
            const { get } = definitions;
            expect(get).toBeDefined();
            expect(get.middleware.length).toBe(2);
            expect(get.middleware[0].name).toBe('middlewareA');
            expect(get.middleware[1].name).toBe('middlewareB');
        });
    });
});