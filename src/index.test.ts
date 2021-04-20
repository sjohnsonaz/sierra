import * as request from 'supertest';

import { createHandler } from './request-handler';
import { createServer } from './server';

describe('Sierra', function () {
    it('should create a Sierra application', async function () {
        const server = createServer(
            createHandler().use(async () => ({
                value: 'test',
            }))
        );
        const { body } = await request(server).get('/').expect(200);
        expect(body).toStrictEqual({ value: 'test' });
    });
});
