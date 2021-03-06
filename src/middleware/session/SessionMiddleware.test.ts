import { createServer, Server } from 'http';

import * as request from 'supertest';

import { RequestHandler } from '../../server';

import { SessionMiddleware } from './SessionMiddleware';

describe('SessionMiddleware', function () {
    let server: Server;
    let handler: RequestHandler;

    beforeEach(async function () {
        handler = new RequestHandler();
        server = createServer(handler.callback);
    });

    it('should call Session.load', async function () {
        const gateway = {
            getId: async () => '',
            load: jest.fn(async () => ({})),
            save: async () => true,
            destroy: async () => true
        };
        const sessionMiddlware = new SessionMiddleware(gateway);
        handler.use(sessionMiddlware.handle);
        await request(server)
            .get('/')
            .expect(200);
        expect(gateway.load.mock.calls.length).toBe(1);
    });
});
