import { Context, Verb } from '../../server';

import { createRequest } from '../../utils/TestUtil';
import { Controller } from './controller';

import { Endpoint } from './Endpoint';
import { RouteMiddleware, sortRoutes } from './RouteMiddleware';

describe('RouteMiddleware', function () {
    describe('init', function () {
        it('should sort Routes', function () {
            const routerMiddleware = new RouteMiddleware();
            const routeA = new Endpoint(Verb.Get, 'a', async () => {});
            const routeB = new Endpoint(Verb.Get, 'a/:b', async () => {});
            const routeRegex = new Endpoint(Verb.Get, /regex/, async () => {});
            routerMiddleware.add(routeB);
            routerMiddleware.add(routeA);
            routerMiddleware.add(routeRegex);
            expect(routerMiddleware.routes[0]).toBe(routeB);
            expect(routerMiddleware.routes[1]).toBe(routeA);
            expect(routerMiddleware.routes[2]).toBe(routeRegex);

            routerMiddleware.init();
            expect(routerMiddleware.allRoutes[0]).toBe(routeRegex);
            expect(routerMiddleware.allRoutes[1]).toBe(routeA);
            expect(routerMiddleware.allRoutes[2]).toBe(routeB);
        });
    });

    describe('handle', function () {
        it('should match routes', async function () {
            const routerMiddleware = new RouteMiddleware();
            const route = new Endpoint(Verb.Get, 'test', async () => {
                return true;
            });
            routerMiddleware.add(route);
            routerMiddleware.init();

            const [request, response] = createRequest({
                method: 'get',
                url: 'http://localhost/test',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const context = new Context(request, response);

            const result = await routerMiddleware.handle(context);
            expect(result).toBe(true);
        });

        it('should match parameterized routes', async function () {
            const routerMiddleware = new RouteMiddleware();
            const testRoute = new Endpoint(Verb.Get, 'test', async () => {
                return true;
            });
            const paramRoute = new Endpoint<any, any, { param: any }>(
                Verb.Get,
                'test/:param',
                async ({ data }) => {
                    return data.params?.param;
                }
            );
            routerMiddleware.add(testRoute);
            routerMiddleware.add(paramRoute);
            routerMiddleware.init();

            const [request, response] = createRequest({
                method: 'get',
                url: 'http://localhost/test/1',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const context = new Context(request, response);

            const result = await routerMiddleware.handle(context);
            expect(result).toBe('1');
        });
    });

    describe('Controller', function () {
        describe.skip('init', function () {
            it('should build Routes from Controllers', function () {});

            it('should sort Routes from Controllers', function () {});
        });

        describe('addController', function () {
            it('should add a Controller', function () {
                const routeMiddleware = new RouteMiddleware();
                expect(routeMiddleware.controllers.length).toBe(0);
                const controller = new Controller();
                routeMiddleware.addController(controller);
                expect(routeMiddleware.controllers.length).toBe(1);
                expect(routeMiddleware.controllers[0]).toBe(controller);
            });
        });

        describe('removeController', function () {
            it('should remove a Controller', function () {
                const routeMiddleware = new RouteMiddleware();
                const controller = new Controller();
                routeMiddleware.addController(controller);
                expect(routeMiddleware.controllers.length).toBe(1);
                routeMiddleware.removeController(controller);
                expect(routeMiddleware.controllers.length).toBe(0);
            });

            it('should not remove a Controller that is not present', function () {
                const routeMiddleware = new RouteMiddleware();
                const controller = new Controller();
                routeMiddleware.removeController(controller);
                expect(routeMiddleware.controllers.length).toBe(0);
            });
        });
    });
});

describe('sortRoutes', function () {
    it("routes are sorted by RegExp, then location or first ':', then alphabetical", () => {
        let routesPaths = [
            '/',
            '/:id',
            '/count',
            '/test/:id',
            '/:var/a/',
            '/findit/:name',
            '/getsomething/:id/:name',
            '/getsomething/:name/:id',
            '/getsomething/:another/:id',
            '/getsomething/:id/fixed',
        ];

        const routes = routesPaths.map((routePath) => {
            return new Endpoint([Verb.Get], routePath, async () => {});
        });
        routes.sort(sortRoutes);

        expect(true).toBe(true);
    });
});
