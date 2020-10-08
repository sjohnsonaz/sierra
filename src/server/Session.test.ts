import { Session } from "../Sierra";
import { createRequest } from "../utils/TestUtil";
import Context from "./Context";
import { NoSessionGatewayError } from "./Errors";

describe('Session', function () {
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
            const session = new Session(context, 'id', gateway);
            expect(session.context).toBe(context);
            expect(session.id).toBe('id');
            expect(session.gateway).toBe(gateway);
        });
    });

    describe('save', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, 'id', undefined);
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
            const session = new Session(context, 'id', gateway);
            await session.save();
            expect(gateway.save.mock.calls.length).toBe(1);
        });
    });

    describe('reload', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, 'id', undefined);
            await expect(async () => {
                await session.reload();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.load', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: jest.fn(async () => ''),
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, 'id', gateway);
            await session.reload();
            expect(gateway.load.mock.calls.length).toBe(1);
        });
    });

    describe('destroy', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, 'id', undefined);
            await expect(async () => {
                await session.destroy();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.destroy', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: async () => '',
                save: async () => true,
                destroy: jest.fn(async () => true)
            };
            const session = new Session(context, 'id', gateway);
            await session.destroy();
            expect(gateway.destroy.mock.calls.length).toBe(1);
        });
    });

    describe('regenerate', function () {
        it('should throw NoSessionGatewayError if gateway is undefined', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const session = new Session(context, 'id', undefined);
            await expect(async () => {
                await session.regenerate();
            }).rejects.toThrow(new NoSessionGatewayError());
        });

        it('should call ISessionGateway.save', async function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: jest.fn(async () => ''),
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, 'id', gateway);
            await session.regenerate();
            expect(gateway.load.mock.calls.length).toBe(1);
        });
    });

    describe('touch', function () {
        const MILLISECONDS = 1000;
        const SECONDS = 60;

        it('should change the Cookie expires property', function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const gateway = {
                getId: async () => '',
                load: async () => '',
                save: async () => true,
                destroy: async () => true
            };
            const session = new Session(context, 'id', gateway);
            const now = Date.now();
            const minutes = 60;

            const expiresUTC = session.touch(minutes, now);

            const expiresDate = new Date(expiresUTC);
            const nowUTC = (new Date(now)).toUTCString();
            const nowDate = new Date(nowUTC);
            const delta = expiresDate.getTime() - nowDate.getTime();
            expect(delta).toBe(MILLISECONDS * SECONDS * minutes);
        });
    })
});