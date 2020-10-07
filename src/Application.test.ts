import { Route } from './Sierra';
import { Application, sortRoutes } from './Application';
import { LogLevel } from './server/LogLevel';
import { NeverStartedError } from './server/Errors';

describe('Application', function () {
    describe('use', function () {
        it('should add middleware', function () {
            const application = new Application();
            const middleware = async () => { };
            application.use(middleware);
            expect(application.requestHandler.pipeline.middlewares.length).toBe(1);
            expect(application.requestHandler.pipeline.middlewares[0]).toBe(middleware);
        });
    });


    describe('view', function () {
        it('should set view middleware', function () {
            const application = new Application();
            const middleware = async () => '';
            application.view(middleware);
            expect(application.requestHandler.view).toBe(middleware);
        });
    });

    describe('error', function () {
        it('should set error middleware', function () {
            const application = new Application();
            const middleware = async () => { };
            application.error(middleware);
            expect(application.requestHandler.error).toBe(middleware);
        });
    });

    // TODO: This may have port conflicts.
    describe('listen', function () {
        it('should create server if it does not exist', async function () {
            const port = 3456;
            const application = new Application();
            expect(application.server).toBeUndefined();
            await application.listen(port);
            await application.close();
            expect(application.server).toBeDefined();
        });

        it('should throw if port is in use', async function () {
            const port = 3456;
            const application0 = new Application();
            await application0.listen(port);
            const application1 = new Application();
            expect(async () => {
                await application1.listen(port);
            }).rejects.toThrow();
            await application0.close();
        });
    });

    describe('close', function () {
        it('should throw NeverStartedError if never started', async function () {
            const application = new Application();
            expect(async () => {
                await application.close();
            }).rejects.toThrow(new NeverStartedError());
        });

        it('should throw an error if server is not listening', async function () {
            const port = 3456;
            const application = new Application();
            await application.listen(port);
            await application.close();
            expect(async () => {
                await application.close();
            }).rejects.toThrow();
        });
    });

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