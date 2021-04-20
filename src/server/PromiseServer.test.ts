import { createHandler } from '../handler';

import { PromiseServer } from './PromiseServer';

describe('PromiseServer', function () {
    // TODO: This may have port conflicts.
    describe('listen', function () {
        it('should throw if port is in use', async function () {
            const port = 3456;
            const server0 = new PromiseServer(createHandler());
            await server0.start(port);
            const server1 = new PromiseServer(createHandler());
            await expect(async () => {
                await server1.start(port);
            }).rejects.toThrow();
            await server0.exit();
        });
    });

    describe('close', function () {
        it('should throw an error if server is not listening', async function () {
            const port = 3456;
            const server = new PromiseServer(createHandler());
            await server.start(port);
            await server.exit();
            await expect(async () => {
                await server.exit();
            }).rejects.toThrow();
        });
    });
});
