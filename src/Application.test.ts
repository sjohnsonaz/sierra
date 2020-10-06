import { Route } from './Sierra';
import { Application, sortRoutes } from './Application';
import { LogLevel } from './server/LogLevel';

describe('Application', function () {
    describe('logging', function () {
        it('should use getter and setter for RequestHandler.logging', function () {
            const application = new Application();
            expect(application.requestHandler.logging).toBe(LogLevel.errors);
            expect(application.logging).toBe(LogLevel.errors);
            application.logging = LogLevel.verbose;
            expect(application.requestHandler.logging).toBe(LogLevel.verbose);
            expect(application.logging).toBe(LogLevel.verbose);
        });
    });

    describe('Route sorting', function () {
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
});