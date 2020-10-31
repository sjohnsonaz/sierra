import * as request from 'supertest';

import { Application } from '../../Application';
import { Context } from '../../server';

import { middleware, route } from './Decorators';
import { Controller } from './Controller';
import { RouteBuilder } from './RouteBuilder';
import { RouteDefinition, RouteMethod } from './RouteDefinition';

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

    describe('getRouteBuilder', function () {
        it('should create a RouteBuilder on target', function () {
            class Target {
                _routeBuilder: RouteBuilder
            }

            const target = new Target();
            expect(target._routeBuilder).toBeUndefined();

            const routeBuilder = RouteBuilder.getRouteBuilder(target);
            expect(routeBuilder).toBeInstanceOf(RouteBuilder);

            expect(target._routeBuilder).toBeInstanceOf(RouteBuilder);
            expect(target._routeBuilder).toBe(routeBuilder);
        });

        it('should build a child RouteBuilder targets with parent RouteBuilders', function () {
            interface ITarget {
                _routeBuilder: RouteBuilder
            }
            const Target: (new (...args: any) => ITarget) = (() => {
                function Target() {

                }
                Target.prototype = {
                    _routeBuilder: new RouteBuilder()
                };
                return Target;
            })() as any;

            const target = new Target();
            expect(target._routeBuilder).toBeInstanceOf(RouteBuilder);
            expect(target.hasOwnProperty('_routeBuilder')).toBe(false);

            const routeBuilder = RouteBuilder.getRouteBuilder(target);
            expect(routeBuilder).toBeInstanceOf(RouteBuilder);

            expect(target._routeBuilder).toBeInstanceOf(RouteBuilder);
            expect(target._routeBuilder).toBe(routeBuilder);
            expect(target.hasOwnProperty('_routeBuilder')).toBe(true);
        });
    });

    describe('getKeys', function () {
        it('should get keys of multiple Objects', function () {
            const object0 = {
                a: 0,
                b: 1
            };
            const object1 = {
                c: 2,
                d: 3
            };
            const keys = RouteBuilder.getKeys(object0, object1);
            expect(keys).toStrictEqual(['a', 'b', 'c', 'd']);
        });
    });
});

// TODO: Move these to decorator tests
describe('middleware decorator', () => {
    let application: Application = undefined;

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

        application = new Application();
        application.addController(new TestController());
        application.init();
    });

    it('should run in order', async () => {
        await request(application.server)
            .get('/test')
            .expect(200, { value: true });
    });

    it('should run all middlewares', async () => {
        await request(application.server)
            .post('/test')
            .expect(200, {
                a: 1,
                b: 2
            });
    });
});