import * as http from 'http';

import * as request from 'supertest';

import { RequestHandler, errorTemplate } from './RequestHandler';
import { json, raw, view } from './OutgoingMessage';
import { NotFoundError, NoRouteFoundError, NoViewTemplateError, NoViewMiddlwareError } from './Errors';
import { LogLevel } from './LogLevel';
import { OutgoingMessage } from '../Sierra';

describe('RequestHandler', function () {
    describe('pipeline', function () {
        let server: http.Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            server = http.createServer(handler.callback);
        });

        it('should run requests through a Pipeline', async function () {
            handler.use(async () => {
                return 'a';
            });
            handler.use(async (_context, value: string) => {
                return value + 'b';
            });
            handler.use(async (_context, value: string) => {
                return value + 'c';
            });
            await request(server)
                .get('/')
                .expect(200, JSON.stringify('abc'));
        });
    });

    describe('status', function () {
        let server: http.Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            handler.logging = LogLevel.none;
            server = http.createServer(handler.callback);
        });

        it('should send 200 on success', async function () {
            handler.use(async () => {
                return true;
            });
            await request(server)
                .get('/')
                .expect(200);
        });

        it('should send 404 on not found', async function () {
            handler.use(async () => {
                throw new NotFoundError();
            });
            await request(server)
                .get('/')
                .expect(404);
        });

        it('should send 404 on no route found', async function () {
            handler.use(async () => {
                throw new NoRouteFoundError();
            });
            await request(server)
                .get('/')
                .expect(404);
        });

        it('should send 500 on error', async function () {
            handler.use(async () => {
                throw 'error';
            });
            await request(server)
                .get('/')
                .expect(500);
        });
    });

    describe('send', function () {
        let server: http.Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();

            handler.error = async function (_context, error) {
                return error;
            };

            handler.view = async function (_context, data, template) {
                const templates: Record<string, Function> = {
                    index: function (data: { value: boolean }) {
                        return `index: value = ${data.value}`;
                    }
                }
                const templateFunction = templates[template];
                if (!templateFunction) {
                    throw new NoViewTemplateError(template);
                }
                return templateFunction(data);
            };

            server = http.createServer(handler.callback);
        });

        describe('OutgoingMessage type: "auto"', function () {
            describe('accept', function () {
                it('should detect accept "text/html"', async function () {
                    handler.use(async () => {
                        return { value: true };
                    });

                    await request(server)
                        .get('/')
                        .set('Accept', 'text/html')
                        .expect(200, 'index: value = true');
                });

                it('should detect accept "application/json"', async function () {
                    handler.use(async () => {
                        return { value: true };
                    });

                    await request(server)
                        .get('/')
                        .set('Accept', 'application/json')
                        .expect(200, { value: true });
                });

                it('should send raw on default', async function () {
                    handler.use(async () => {
                        return { value: true };
                    });

                    await request(server)
                        .get('/')
                        .expect(200, { value: true });
                });
            });
        });

        describe('OutgoingMessage type: "json"', function () {
            it('should send JSON', async function () {
                handler.use(async () => {
                    return json({ value: true });
                });

                await request(server)
                    .get('/')
                    .expect(200, { value: true });
            });
        });

        describe('OutgoingMessage type: "raw"', function () {
            it('should detect outgoing type', async function () {
                handler.use(async () => {
                    return raw({ value: true });
                });

                await request(server)
                    .get('/')
                    .expect(200, { value: true });
            });
        });

        describe('OutgoingMessage type: "text"', function () {
            it('should detect outgoing type, but set "Content-Type" to "text/plain"', async function () {
                handler.use(async () => {
                    return new OutgoingMessage({ value: true }, 200, 'text');
                });

                const { text } = await request(server)
                    .get('/')
                    .expect('Content-Type', 'text/plain')
                    .type('text/plain')
                    .expect(200);//, { value: true });
                expect(text).toBe(JSON.stringify({ value: true }));
            });
        });

        describe('OutgoingMessage type: "view"', function () {
            it('should send a View', async function () {
                handler.use(async () => {
                    return view({ value: true });
                });

                await request(server)
                    .get('/')
                    .expect(200, 'index: value = true');
            });
        });

        describe('OutgoingMessage type: default', function () {
            it('should send raw', async function () {
                handler.use(async () => {
                    return new OutgoingMessage({ value: true }, 200, null);
                });

                await request(server)
                    .get('/')
                    .expect(200, { value: true });
            });
        });
    });

    describe('sendJson', function () {
        let server: http.Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            server = http.createServer(handler.callback);
        });

        it('should handle HTTP requests', async function () {
            handler.use(async function (context) {
                return true;
            });
            await request(server)
                .get('/')
                .expect(200, 'true');
        });

        it('should send false responses', async function () {
            handler.use(async function (context) {
                return false;
            });
            await request(server)
                .get('/')
                .expect(200, 'false');
        });

        it('should send null responses', async function () {
            handler.use(async function (context) {
                return null;
            });
            await request(server)
                .get('/')
                .expect(200, 'null');
        });

        it('should cast undefined responses to null', async function () {
            handler.use(async function (context) {
                return undefined;
            });
            await request(server)
                .get('/')
                .expect(200, null);
        });

        it('should send object responses', async function () {
            handler.use(async function () {
                return { value: 'test' };
            });
            await request(server)
                .get('/')
                .expect(200, { value: 'test' });
        });
    });

    describe('sendView', function () {
        describe('NoViewMiddlewareError', function () {
            let server: http.Server;
            let handler: RequestHandler;

            beforeEach(async function () {
                handler = new RequestHandler();
                handler.logging = LogLevel.none;

                handler.error = async function (_context, error) {
                    return error;
                };

                server = http.createServer(handler.callback);
            });

            it('should throw NoViewTemplateError when no template is found', async function () {
                handler.use(async function () {
                    return view({ value: true });
                });

                await request(server)
                    .get('/')
                    .expect(500, errorTemplate(new NoViewMiddlwareError()));
            });
        });

        describe('middleware available', function () {
            let server: http.Server;
            let handler: RequestHandler;

            beforeEach(async function () {
                handler = new RequestHandler();
                handler.logging = LogLevel.none;

                handler.error = async function (_context, error) {
                    return error;
                };

                handler.view = async function (_context, data, template) {
                    const templates: Record<string, Function> = {
                        index: function (data: { value: boolean }) {
                            return `index: value = ${data.value}`;
                        },
                        test: function (data: { value: boolean }) {
                            return `test: value = ${data.value}`;
                        }
                    }
                    const templateFunction = templates[template];
                    if (!templateFunction) {
                        throw new NoViewTemplateError(template);
                    }
                    return templateFunction(data);
                };

                server = http.createServer(handler.callback);
            });
            it('should send index view by default', async function () {
                handler.use(async function () {
                    return view({ value: true });
                });

                await request(server)
                    .get('/')
                    .expect(200, 'index: value = true');
            });

            it('should send named view', async function () {
                handler.use(async function () {
                    return view({ value: true }, 'test');
                });

                await request(server)
                    .get('/')
                    .expect(200, 'test: value = true');
            });

            it('should send unknown view as JSON', async function () {
                handler.use(async function () {
                    return view({ value: true }, 'other');
                });

                await request(server)
                    .get('/')
                    .expect(200, { value: true });
            });
        });
    });

    describe('sendRaw', function () {
        let server: http.Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            server = http.createServer(handler.callback);
        });

        it('should send text/plain', async function () {
            handler.use(async function (context) {
                return new OutgoingMessage('true', 200, 'raw');
            });
            await request(server)
                .get('/')
                .expect('Content-Type', 'text/plain')
                .expect(200, 'true');
        });

        it('should send octet-stream', async function () {
            handler.use(async function (context) {
                const buffer = Buffer.from('1234');
                return new OutgoingMessage(buffer, 200, 'raw');
            });
            await request(server)
                .get('/')
                .expect('Content-Type', 'octet-stream')
                .expect(200, '1234');
        });

        it('should send application/json', async function () {
            handler.use(async function (context) {
                return new OutgoingMessage({ value: true }, 200, 'raw');
            });
            await request(server)
                .get('/')
                .expect('Content-Type', 'application/json')
                .expect(200, { value: true });
        });
    });

    describe('error', function () {
        let server: http.Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            handler.logging = LogLevel.none;

            handler.view = async function (_context, data, template) {
                const templates: Record<string, Function> = {
                    index: function (data: string) {
                        return `index: error = ${data}`;
                    },
                    error: function (data: string) {
                        return `error: error = ${data}`;
                    }
                }
                const templateFunction = templates[template];
                if (!templateFunction) {
                    throw new NoViewTemplateError(template);
                }
                return templateFunction(data);
            };

            server = http.createServer(handler.callback);
        });
        it('should not run error by default', async function () {
            const errorHandler = jest.fn(async function (_context, error) {
                return error;
            });
            handler.error = errorHandler;

            handler.use(async function () {
                return true;
            });

            await request(server)
                .get('/')
                .expect(200, JSON.stringify(true));
            expect(errorHandler.mock.calls.length).toBe(0);
        });

        it('should run error on error', async function () {
            const errorHandler = jest.fn(async function (_context, error) {
                return error;
            });
            handler.error = errorHandler;

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server)
                .get('/')
                .expect(500, JSON.stringify("error thrown"));
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should run error with OutgoingMessage', async function () {
            const errorHandler = jest.fn(async function (_context, error) {
                return new OutgoingMessage(error, 404);
            });
            handler.error = errorHandler;

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server)
                .get('/')
                .expect(404, JSON.stringify("error thrown"));
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should run error with View', async function () {
            const errorHandler = jest.fn(async function (_context, error) {
                return view(error);
            });
            handler.error = errorHandler;

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server)
                .get('/')
                .expect(200, 'index: error = error thrown');
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should run error with View by Accept header', async function () {
            const errorHandler = jest.fn(async function (_context, error) {
                return error;
            });
            handler.error = errorHandler;

            handler.use(async function () {
                throw 'error thrown';
            });

            const { text } = await request(server)
                .get('/')
                .set('Accept', 'text/html')
                .expect(500);
            expect(text).toBe('error: error = error thrown');
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should handle error in error', async function () {
            const errorHandler = jest.fn(async function (_context, error) {
                throw 'inner error thrown';
            });
            handler.error = errorHandler;

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server)
                .get('/')
                .expect(500, JSON.stringify("inner error thrown"));
            expect(errorHandler.mock.calls.length).toBe(1);
        });
    });
});
