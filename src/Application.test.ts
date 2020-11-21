import { Application } from './Application';
import { LogLevel } from './server/LogLevel';
import { Controller } from './middleware/route';

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
            expect(application.requestHandler.viewPipeline.middlewares).toContain(middleware);
        });
    });

    describe('error', function () {
        it('should set error middleware', function () {
            const application = new Application();
            const middleware = async () => { };
            application.error(middleware);
            expect(application.requestHandler.errorPipeline.middlewares).toContain(middleware);
        });
    });

    // TODO: This may have port conflicts.
    describe('listen', function () {
        it('should throw if port is in use', async function () {
            const port = 3456;
            const application0 = new Application();
            await application0.listen(port);
            const application1 = new Application();
            await expect(async () => {
                await application1.listen(port);
            }).rejects.toThrow();
            await application0.close();
        });
    });

    describe('close', function () {
        it('should throw an error if server is not listening', async function () {
            const port = 3456;
            const application = new Application();
            await application.listen(port);
            await application.close();
            await expect(async () => {
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


    describe('addController', function () {
        it('should add a Controller', function () {
            const application = new Application();
            expect(application.controllers.length).toBe(0);
            const controller = new Controller();
            application.addController(controller);
            expect(application.controllers.length).toBe(1);
            expect(application.controllers).toContain(controller);
        });
    });

    describe('removeController', function () {
        it('should remove a Controller', function () {
            const application = new Application();
            const controller = new Controller();
            application.addController(controller);
            expect(application.controllers.length).toBe(1);
            application.removeController(controller);
            expect(application.controllers.length).toBe(0);
        });

        it('should not remove a Controller that is not present', function () {
            const application = new Application();
            const controller = new Controller();
            application.removeController(controller);
            expect(application.controllers.length).toBe(0);
        });
    });
});
