import * as http from 'http';
import * as request from 'supertest';
import { RequestHandler } from '../../server/RequestHandler';
import { BodyMiddleware } from '../../Sierra';


describe('BodyMiddleware', function () {
    let server: http.Server;
    let handler: RequestHandler;

    beforeEach(async function () {
        handler = new RequestHandler();
        server = http.createServer(handler.callback);
    });

    it('should read "application/json" data', async function () {
        handler.use(BodyMiddleware.handle);
        handler.use((context) => {
            return context.body;
        });

        await request(server)
            .post('/')
            .send({
                value: true
            })
            .expect(200, {
                value: true
            });
    });

    it('should read "multipart/form-data" data', async function () {
        handler.use(BodyMiddleware.handle);
        handler.use((context) => {
            return context.body;
        });

        await request(server)
            .post('/')
            .field('value', true)
            .expect(200, {
                value: 'true'
            });
    });

    it('should read "application/x-www-form-urlencoded" data', async function () {
        handler.use(BodyMiddleware.handle);
        handler.use((context) => {
            return context.body;
        });

        await request(server)
            .post('/')
            .type('form')
            .send({
                value: true
            })
            .expect(200, {
                value: 'true'
            });
    });
});
