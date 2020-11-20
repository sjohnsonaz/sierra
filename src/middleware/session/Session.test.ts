import { createRequest } from '../../utils/TestUtil';

import { Context, NoSessionGatewayError } from '../../server';
import { Cookie } from '../../server/cookie';

import { Session } from './Session';

describe('Session', function () {
    // const MILLISECONDS = 1;
    // const SECONDS = 1000 * MILLISECONDS;
    // const MINUTES = 60 * SECONDS;
    // const HOURS = 60 * MINUTES;

    describe('constructor', function () {
        it('should initialize properties', function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: async () => '',
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, gateway);
            expect(session.context).toBe(context);
            expect(session.gateway).toBe(gateway);
        });
    });

    describe('save', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, undefined as any);
            await expect(async () => {
                await session.save();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.save', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: async () => '',
                save: jest.fn(async () => true),
                destroy: async () => true
            };
            const session = new Session(context, gateway);
            await session.save();
            expect(gateway.save.mock.calls.length).toBe(1);
        });
    });

    describe('init', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, undefined as any);
            await expect(async () => {
                await session.init();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.load', async function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('sierra_id', 'id');
            request.headers['cookie'] = cookie.toString();
            const context = new Context(request, response);
            const gateway = {
                getId: jest.fn(async () => ''),
                load: jest.fn(async () => ''),
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, gateway);
            await session.init();
            expect(gateway.getId.mock.calls.length).toBe(0);
            expect(gateway.load.mock.calls.length).toBe(1);
        });

        it('should call ISessionGateway.getId if no Cookie is present', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: jest.fn(async () => ''),
                load: jest.fn(async () => ''),
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, gateway);
            await session.init();
            expect(gateway.getId.mock.calls.length).toBe(1);
            expect(gateway.load.mock.calls.length).toBe(1);
        });
    });

    describe('destroy', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, undefined as any);
            await expect(async () => {
                await session.destroy();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.destroy', async function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('sierra_id', 'id');
            request.headers['cookie'] = cookie.toString();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: async () => '',
                save: async () => true,
                destroy: jest.fn(async () => true)
            };
            const session = new Session(context, gateway);
            session.id = 'id';
            await session.destroy();
            expect(gateway.destroy.mock.calls.length).toBe(1);
        });
    });

    describe('regenerate', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, undefined as any);
            await expect(async () => {
                await session.regenerate();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.load', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: jest.fn(async () => 'id'),
                load: jest.fn(async () => ''),
                save: async () => true,
                destroy: jest.fn(async () => true)
            };
            const session = new Session(context, gateway);
            session.id = 'id';
            await session.regenerate();
            expect(gateway.getId.mock.calls.length).toBe(1);
            expect(gateway.load.mock.calls.length).toBe(1);
            expect(gateway.destroy.mock.calls.length).toBe(1);
        });
    });

    describe('touch', function () {
        // TODO: Update when cookie age is working
        it('should change the Cookie expires property', function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('sierra_id', 'id');
            request.headers['cookie'] = cookie.toString();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: async () => '',
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, gateway);
            const updatedCookie = session.touch();
            expect(updatedCookie?.maxAge).toBeUndefined();
        });
    })

    describe('load', function () {
        it('should call gateway.load', async function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('sierra_id', 'id');
            request.headers['cookie'] = cookie.toString();
            const context = new Context(request, response);
            const gateway = {
                getId: jest.fn(async () => ''),
                load: jest.fn(async () => ''),
                save: async () => true,
                destroy: async () => true
            };
            await Session.load(context, gateway);
            expect(gateway.getId.mock.calls.length).toBe(0);
            expect(gateway.load.mock.calls.length).toBe(1);
        });

        it('should call gateway.getId when no id is present', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: jest.fn(async () => ''),
                load: async () => '',
                save: async () => true,
                destroy: async () => true
            };
            await Session.load(context, gateway);
            expect(gateway.getId.mock.calls.length).toBe(1);
        });
    });
});