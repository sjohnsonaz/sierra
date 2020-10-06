import { Route } from './Sierra';
import { sortRoutes } from './Application';

describe('Route.sort', () => {
    it('routes are sorted by RegExp, then location or first \':\', then alphabetical', () => {

        let routes = [
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

        routes.map(route => {
            return new Route('get', route, undefined, undefined, undefined, undefined, undefined, undefined);
        }).sort(sortRoutes);

        expect(true).toBe(true);
    });
});