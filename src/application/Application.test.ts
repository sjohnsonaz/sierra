import * as request from 'supertest';

import { LogLevel } from '../server';

import { Application } from './Application';

describe('Application', function () {
    describe('use', function () {
        it('should add middleware', function () {
            const application = new Application();
            const middleware = async () => {};
            application.use(middleware);
            expect(application.requestHandler.pipeline.middlewares.length).toBe(1);
            expect(application.requestHandler.pipeline.middlewares[0]).toBe(middleware);
        });

        it('should support chaining', async function () {
            const application = new Application()
                .use<{ value: string }>(async ({ data }) => {
                    data.value = 'a';
                })
                .use(async ({ data }) => {
                    data.value += 'b';
                })
                .use(async ({ data }) => {
                    return `${data.value}c`;
                });
            await request(application.server).get('/').expect(200, JSON.stringify('abc'));
        });
    });

    describe('view', function () {
        it('should set view middleware', function () {
            const application = new Application();
            const middleware = async () => '';
            application.useView(middleware);
            expect(application.requestHandler.viewPipeline.middlewares).toContain(middleware);
        });
    });

    describe('error', function () {
        it('should set error middleware', function () {
            const application = new Application();
            const middleware = async () => {};
            application.useError(middleware);
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
            expect(application.requestHandler.logging).toBe(LogLevel.Errors);
            expect(application.logging).toBe(LogLevel.Errors);
            application.logging = LogLevel.Verbose;
            expect(application.requestHandler.logging).toBe(LogLevel.Verbose);
            expect(application.logging).toBe(LogLevel.Verbose);
        });
    });
});
