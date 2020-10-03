import * as http from 'http';
import * as fs from 'fs';

import * as request from 'supertest';
import Handlebars from 'handlebars';

import { RequestHandler } from './RequestHandler';

describe('RequestHandler', function () {
    let server: http.Server;
    let handler: RequestHandler;

    beforeEach(async function () {
        handler = new RequestHandler();

        handler.error = async function (_context, error) {
            return error;
        };

        handler.view = async function (_context, data) {
            var template = await new Promise((resolve, reject) => {
                fs.readFile('./view/index.handlebars', {
                    encoding: 'utf8'
                }, (err, data: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
            var compiledTemplate = Handlebars.compile(template);
            return compiledTemplate(data);
        }
        server = http.createServer(handler.callback);
    });

    it('should handle HTTP requests', async function () {
        handler.use(async function (context) {
            return context.send(true);
        });
        await request(server)
            .get('/')
            .expect(200, 'true');
    });

    it('should send false responses', async function () {
        handler.use(async function (context) {
            return context.send(false);
        });
        await request(server)
            .get('/')
            .expect(200, 'false');
    });

    it('should send null responses', async function () {
        handler.use(async function (context) {
            return context.send(null);
        });
        await request(server)
            .get('/')
            .expect(200, 'null');
    });

    it('should cast undefined responses to null', async function () {
        handler.use(async function (context) {
            return context.send(undefined);
        });
        await request(server)
            .get('/')
            .expect(200, null);
    });

    it('should send object responses', async function () {
        handler.use(async function (context) {
            return context.send({ value: 'test' });
        });
        await request(server)
            .get('/')
            .expect(200, { value: 'test' });
    });
});