import * as http from 'http';

import * as request from 'supertest';

import { RequestHandler } from './RequestHandler';
import { view } from './OutgoingMessage';
import { NotFoundError, NoRouteFoundError, NoViewTemplateError } from './Errors';
import { LogLevel } from './LogLevel';

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

    describe('view', function () {
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
    });
});
