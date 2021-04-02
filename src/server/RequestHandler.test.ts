import { createServer, Server } from 'http';

import * as request from 'supertest';

import { Color } from '../utils/ConsoleUtil';

import { RequestHandler, errorTemplate, colorStatus } from './RequestHandler';
import { auto, error, json, raw, text, view } from './response-directive';
import { NotFoundError, NoRouteFoundError, NoViewTemplateError, NonStringViewError } from './Errors';
import { LogLevel } from './LogLevel';

describe('RequestHandler', function () {
    describe('pipeline', function () {
        let server: Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            server = createServer(handler.callback);
        });

        it('should run requests through a Pipeline', async function () {
            handler
                .use<{ value: string }>(async ({ data }) => {
                    data.value = 'a';
                })
                .use<{ value: string }>(async ({ data }) => {
                    data.value += 'b';
                })
                .use(async ({ data }) => {
                    return data.value + 'c';
                });
            await request(server).get('/').expect(200, JSON.stringify('abc'));
        });
    });

    describe('status', function () {
        let server: Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            handler.logging = LogLevel.none;
            server = createServer(handler.callback);
        });

        it('should send 200 on success', async function () {
            handler.use(async () => {
                return true;
            });
            await request(server).get('/').expect(200);
        });

        it('should send 404 on not found', async function () {
            handler.use(async () => {
                throw new NotFoundError();
            });
            await request(server).get('/').expect(404);
        });

        it('should send 404 on no route found', async function () {
            handler.use(async () => {
                throw new NoRouteFoundError();
            });
            await request(server).get('/').expect(404);
        });

        it('should send 500 on error', async function () {
            handler.use(async () => {
                throw 'error';
            });
            await request(server).get('/').expect(500);
        });
    });

    describe('send', function () {
        let server: Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();

            // handler.useError(async function (_context) {
            //     return error;
            // });

            handler.useView(async function (context) {
                const { view } = context;
                const templates: Record<string, (...args: any) => string> = {
                    index: function (data: { value: boolean }) {
                        return `index: value = ${data.value}`;
                    },
                };
                const templateFunction = templates[context.template || ''];
                if (!templateFunction) {
                    throw new NoViewTemplateError(context.template || '');
                }
                return templateFunction(view.value);
            });

            server = createServer(handler.callback);
        });

        describe('ResponseDirective type: "auto"', function () {
            describe('accept', function () {
                it('should detect accept text/html', async function () {
                    handler.use(async () => {
                        return { value: true };
                    });

                    await request(server).get('/').set('Accept', 'text/html').expect(200, 'index: value = true');
                });

                it('should detect accept application/json', async function () {
                    handler.use(async () => {
                        return { value: true };
                    });

                    await request(server).get('/').set('Accept', 'application/json').expect(200, { value: true });
                });

                it('should send raw on default', async function () {
                    handler.use(async () => {
                        return { value: true };
                    });

                    await request(server).get('/').expect(200, { value: true });
                });
            });
        });

        describe('ResponseDirective type: "json"', function () {
            it('should send JSON', async function () {
                handler.use(async () => {
                    return json({ value: true });
                });

                await request(server).get('/').expect(200, { value: true });
            });
        });

        describe('ResponseDirective type: "raw"', function () {
            it('should detect outgoing type', async function () {
                handler.use(async () => {
                    return raw({ value: true });
                });

                await request(server).get('/').expect(200, { value: true });
            });
        });

        describe('ResponseDirective type: "text"', function () {
            it('should detect outgoing type, but set "Content-Type" to "text/plain"', async function () {
                handler.use(async () => {
                    return text({ value: true });
                });

                const { text: _text } = await request(server)
                    .get('/')
                    .expect('Content-Type', 'text/plain')
                    .type('text/plain')
                    .expect(200); //, { value: true });
                expect(_text).toBe(JSON.stringify({ value: true }));
            });
        });

        describe('ResponseDirective type: "view"', function () {
            it('should send a View', async function () {
                handler.use(async () => {
                    return view({ value: true });
                });

                await request(server).get('/').expect(200, 'index: value = true');
            });
        });

        describe('ResponseDirective type: default', function () {
            it('should send raw', async function () {
                handler.use(async () => {
                    return { value: true };
                });

                await request(server).get('/').expect(200, { value: true });
            });
        });
    });

    describe('sendJson', function () {
        let server: Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            server = createServer(handler.callback);
        });

        it('should handle HTTP requests', async function () {
            handler.use(async function (context) {
                return true;
            });
            await request(server).get('/').expect(200, 'true');
        });

        it('should send false responses', async function () {
            handler.use(async function (context) {
                return false;
            });
            await request(server).get('/').expect(200, 'false');
        });

        it('should send null responses', async function () {
            handler.use(async function (context) {
                return null;
            });
            await request(server).get('/').expect(200, 'null');
        });

        it('should cast undefined responses to null', async function () {
            handler.use(async function (context) {
                return undefined;
            });
            await request(server).get('/').expect(200, null);
        });

        it('should send object responses', async function () {
            handler.use(async function () {
                return { value: 'test' };
            });
            await request(server).get('/').expect(200, { value: 'test' });
        });
    });

    describe('sendView', function () {
        describe('no middleware', function () {
            let server: Server;
            let handler: RequestHandler;

            beforeEach(async function () {
                handler = new RequestHandler();
                handler.logging = LogLevel.none;

                // handler.useError(async function (_context) {
                //     return error;
                // });

                server = createServer(handler.callback);
            });

            it('should return JSON', async function () {
                handler.use(async function () {
                    return view({ value: true });
                });

                const { text } = await request(server).get('/').expect(500);
                expect(text).toBe(errorTemplate(new NonStringViewError({ value: true })));
            });
        });

        describe('middleware available', function () {
            let server: Server;
            let handler: RequestHandler;

            beforeEach(async function () {
                handler = new RequestHandler();
                handler.logging = LogLevel.none;

                // handler.useError(async function (_context, error) {
                //     return error;
                // });

                handler.useView(async function (context) {
                    const { view } = context;
                    const templates: Record<string, Function> = {
                        index: function (data: { value: boolean }) {
                            return `index: value = ${data.value}`;
                        },
                        test: function (data: { value: boolean }) {
                            return `test: value = ${data.value}`;
                        },
                    };
                    const templateFunction = templates[context.template || ''];
                    if (!templateFunction) {
                        throw new NoViewTemplateError(context.template || '');
                    }
                    return templateFunction(view.value);
                });

                server = createServer(handler.callback);
            });
            it('should send index view by default', async function () {
                handler.use(async function () {
                    return view({ value: true });
                });

                await request(server).get('/').expect(200, 'index: value = true');
            });

            it('should send named view', async function () {
                handler.use(async function () {
                    return view({ value: true }, { template: 'test' });
                });

                await request(server).get('/').expect(200, 'test: value = true');
            });

            it('should throw NoViewTemplateError when no template is found', async function () {
                handler.use(async function () {
                    return view({ value: true }, { template: 'other' });
                });

                const { text } = await request(server).get('/').expect(500);
                expect(text).toBe(errorTemplate(new NoViewTemplateError('index')));
            });
        });
    });

    describe('sendRaw', function () {
        let server: Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            server = createServer(handler.callback);
        });

        it('should send text/plain', async function () {
            handler.use(async function (context) {
                return raw('true');
            });
            await request(server).get('/').expect('Content-Type', 'text/plain').expect(200, 'true');
        });

        it('should send octet-stream', async function () {
            handler.use(async function (context) {
                const buffer = Buffer.from('1234');
                return raw(buffer);
            });
            await request(server).get('/').expect('Content-Type', 'octet-stream').expect(200, '1234');
        });

        it('should send application/json', async function () {
            handler.use(async function (context) {
                return raw({ value: true });
            });
            await request(server).get('/').expect('Content-Type', 'application/json').expect(200, { value: true });
        });
    });

    describe('error', function () {
        let server: Server;
        let handler: RequestHandler;

        beforeEach(async function () {
            handler = new RequestHandler();
            handler.logging = LogLevel.none;

            handler.useView(async function (context) {
                const { view } = context;
                const templates: Record<string, Function> = {
                    index: function (data: string) {
                        return `index: error = ${data}`;
                    },
                    error: function (data: string) {
                        return `error: error = ${data}`;
                    },
                };
                const templateFunction = templates[context.template || ''];
                if (!templateFunction) {
                    throw new NoViewTemplateError(context.template || '');
                }
                return templateFunction(view.value);
            });

            server = createServer(handler.callback);
        });
        it('should not run error by default', async function () {
            const errorHandler = jest.fn(async function () {});
            handler.useError(errorHandler);

            handler.use(async function () {
                return true;
            });

            await request(server).get('/').expect(200, JSON.stringify(true));
            expect(errorHandler.mock.calls.length).toBe(0);
        });

        it('should run error on error', async function () {
            let errorHandler;
            handler.useError(
                (errorHandler = jest.fn(async function (context) {
                    return context.error;
                }))
            );

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server).get('/').expect(500, JSON.stringify('error thrown'));
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should run error with ResponseDirective', async function () {
            const errorHandler = jest.fn(async function (context) {
                return json(context.error.message, { status: 404 });
            });
            handler.useError(errorHandler);

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server).get('/').expect(404, JSON.stringify('error thrown'));
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should run error with View', async function () {
            const errorHandler = jest.fn(async function (context) {
                return view(context.error.message);
            });
            handler.useError(errorHandler);

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server).get('/').expect(200, 'index: error = error thrown');
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should run error with View by Accept header', async function () {
            const errorHandler = jest.fn(async function (context) {
                return error(context.error);
            });
            handler.useError(errorHandler);

            handler.use(async function () {
                throw 'error thrown';
            });

            const { text } = await request(server).get('/').set('Accept', 'text/html').expect(500);
            expect(text).toBe('error: error = error thrown');
            expect(errorHandler.mock.calls.length).toBe(1);
        });

        it('should handle error in error', async function () {
            const errorHandler = jest.fn(async function () {
                throw 'inner error thrown';
            });
            handler.useError(errorHandler);

            handler.use(async function () {
                throw 'error thrown';
            });

            await request(server).get('/').expect(500, JSON.stringify('inner error thrown'));
            expect(errorHandler.mock.calls.length).toBe(1);
        });
    });

    describe('logging', function () {
        describe('colorStatus', function () {
            it('should show white on 100', function () {
                const status = 100;
                const result = colorStatus(status);
                const expected = Color.white(status);
                expect(result).toBe(expected);
            });

            it('should show green on 200', function () {
                const status = 200;
                const result = colorStatus(status);
                const expected = Color.green(status);
                expect(result).toBe(expected);
            });

            it('should show blue on 300', function () {
                const status = 300;
                const result = colorStatus(status);
                const expected = Color.blue(status);
                expect(result).toBe(expected);
            });

            it('should show yellow on 400', function () {
                const status = 400;
                const result = colorStatus(status);
                const expected = Color.yellow(status);
                expect(result).toBe(expected);
            });

            it('should show red on 500', function () {
                const status = 500;
                const result = colorStatus(status);
                const expected = Color.red(status);
                expect(result).toBe(expected);
            });

            it('should show brightBlack on < 100', function () {
                const status = 0;
                const result = colorStatus(status);
                const expected = Color.brightBlack(status);
                expect(result).toBe(expected);
            });

            it('should show brightBlack on >= 600', function () {
                const status = 600;
                const result = colorStatus(status);
                const expected = Color.brightBlack(status);
                expect(result).toBe(expected);
            });
        });
    });
});
