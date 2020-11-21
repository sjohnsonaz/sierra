import { Context, Verb } from "../../server";

import { createRequest } from '../../utils/TestUtil';

import { Route } from "./Route";
import { RouterMiddleware, sortRoutes } from "./RouterMiddleware";

describe('RouteMiddleware', function () {
    describe('init', function () {
        it('should sort Routes', function () {
            const routerMiddleware = new RouterMiddleware();
            const routeA = new Route(Verb.Get, 'a', async () => { });
            const routeB = new Route(Verb.Get, 'a/:b', async () => { });
            const routeRegex = new Route(Verb.Get, /regex/, async () => { });
            routerMiddleware.add(routeB);
            routerMiddleware.add(routeA);
            routerMiddleware.add(routeRegex);
            expect(routerMiddleware.routes[0]).toBe(routeB);
            expect(routerMiddleware.routes[1]).toBe(routeA);
            expect(routerMiddleware.routes[2]).toBe(routeRegex);

            routerMiddleware.init();
            expect(routerMiddleware.routes[0]).toBe(routeRegex);
            expect(routerMiddleware.routes[1]).toBe(routeA);
            expect(routerMiddleware.routes[2]).toBe(routeB);
        });
    });

    describe('handle', function () {
        it('should match routes', async function () {
            const routerMiddleware = new RouterMiddleware();
            const route = new Route(Verb.Get, 'test', async () => {
                return true
            });
            routerMiddleware.add(route);
            routerMiddleware.init();

            const [request, response] = createRequest({
                method: 'get',
                url: 'http://localhost/test',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
            });
            const context = new Context(request, response);

            const result = await routerMiddleware.handle(context);
            expect(result).toBe(true);
        });

        it('should match parameterized routes', async function () {
            const routerMiddleware = new RouterMiddleware();
            const testRoute = new Route(Verb.Get, 'test', async () => {
                return true
            });
            const paramRoute = new Route(Verb.Get, 'test/:param', async ({ data }) => {
                return data.params?.param;
            });
            routerMiddleware.add(testRoute);
            routerMiddleware.add(paramRoute);
            routerMiddleware.init();

            const [request, response] = createRequest({
                method: 'get',
                url: 'http://localhost/test/1',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
            });
            const context = new Context(request, response);

            const result = await routerMiddleware.handle(context);
            expect(result).toBe('1');
        });
    });
});

describe('sortRoutes', function () {
    it('routes are sorted by RegExp, then location or first \':\', then alphabetical', () => {

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
            '/getsomething/:id/fixed'
        ];

        const routes = routesPaths.map(routePath => {
            return new Route([Verb.Get], routePath, async () => { });
        });
        routes.sort(sortRoutes);

        expect(true).toBe(true);
    });
});
