import * as request from 'supertest';

import Sierra, { Controller, route, Context, middleware, RouteBuilder, RouteDefinition } from '../../Sierra';
import { RouteMethod } from './RouteDefinition';

describe('RouteBuilder', function () {
    describe('constructor', function () {
        it('should set properties', function () {
            const parent = new RouteBuilder();
            const child = new RouteBuilder(parent);

            expect(child.parent).toBe(parent);
        });
    });

    describe('addMiddleware', function () {
        it('should create a new RouteDefinition', function () {
            const routeBuilder = new RouteBuilder();
            expect(Object.keys(routeBuilder.routeDefinitions).length).toBe(0);
            const middleware = async () => { };
            routeBuilder.addMiddleware('get', middleware);
            expect(Object.keys(routeBuilder.routeDefinitions).length).toBe(1);
            expect(routeBuilder.routeDefinitions['get']).toBeInstanceOf(RouteDefinition);
        });

        it('should push middleware', function () {
            const routeBuilder = new RouteBuilder();
            const middleware = async () => { };
            routeBuilder.addMiddleware('get', middleware);
            expect(routeBuilder.routeDefinitions['get'].middleware.length).toBe(1);
            expect(routeBuilder.routeDefinitions['get'].middleware[0]).toBe(middleware);
        });
    });

    describe('unshiftMiddleware', function () {
        it('should create a new RouteDefinition', function () {
            const routeBuilder = new RouteBuilder();
            expect(Object.keys(routeBuilder.routeDefinitions).length).toBe(0);
            const middleware = async () => { };
            routeBuilder.addMiddleware('get', middleware);
            expect(Object.keys(routeBuilder.routeDefinitions).length).toBe(1);
            expect(routeBuilder.routeDefinitions['get']).toBeInstanceOf(RouteDefinition);
        });

        it('should unshift middleware', function () {
            const routeBuilder = new RouteBuilder();
            const middleware = async () => { };
            routeBuilder.addMiddleware('get', middleware);
            expect(routeBuilder.routeDefinitions['get'].middleware.length).toBe(1);
            expect(routeBuilder.routeDefinitions['get'].middleware[0]).toBe(middleware);
        });
    });

    describe('addDefinition', function () {
        it('should create a new RouteDefinition', function () {
            const routeBuilder = new RouteBuilder();
            expect(Object.keys(routeBuilder.routeDefinitions).length).toBe(0);
            routeBuilder.addDefinition('get', 'get', 'get', false, false);
            expect(Object.keys(routeBuilder.routeDefinitions).length).toBe(1);
            expect(routeBuilder.routeDefinitions['get']).toBeInstanceOf(RouteDefinition);
        });

        it('should create a new RouteMethod', function () {
            const routeBuilder = new RouteBuilder();
            routeBuilder.addDefinition('get', 'get', 'get', false, false);
            expect(routeBuilder.routeDefinitions['get'].method).toBeInstanceOf(RouteMethod);
        });
    });
});

// TODO: Move these to decorator tests
describe('middleware decorator', () => {
    let application: Sierra = undefined;

    beforeAll(async () => {
        class TestController extends Controller {
            @middleware(async (_context) => {
                return false;
            })
            @middleware(async (_context) => {
                return true;
            })
            @route('get')
            async get(_context: Context, value: boolean) {
                return { value: value };
            }

            @middleware(async (_context) => {
                return { a: 1 };
            })
            @middleware(async (_context, value: any) => {
                value.b = 2;
                return value;
            })
            @route('post')
            async post(_context: Context, value: any) {
                return value;
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        application.init();
    });

    it('should run in order', async () => {
        await request(application.createServer())
            .get('/test')
            .expect(200, { value: true });
    });

    it('should run all middlewares', async () => {
        await request(application.createServer())
            .post('/test')
            .expect(200, {
                a: 1,
                b: 2
            });
    });
});