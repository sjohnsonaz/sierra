import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as http from 'http';
import * as fs from 'fs';

import Handlebars from 'handlebars';

import RequestHandler from './RequestHandler';

describe('RequestHandler', function () {
    const port = 3001;
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
        await new Promise((resolve, reject) => {
            server.listen(port, () => {
                resolve();
            }).on('error', (e) => {
                reject(e);
            });
        });
    });

    afterEach(async function () {
        await new Promise((resolve, reject) => {
            server.close(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });

    it('should handle HTTP requests', async function () {
        handler.use(async function (context) {
            return context.send(true);
        });
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.equal(true);
    });

    it('should send false responses', async function () {
        handler.use(async function (context) {
            return context.send(false);
        });
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.equal(false);
    });

    it('should send null responses', async function () {
        handler.use(async function (context) {
            return context.send(null);
        });
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.equal(null);
    });

    it('should cast undefined responses to null', async function () {
        handler.use(async function (context) {
            return context.send(undefined);
        });
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.equal(null);
    });

    it('should send object responses', async function () {
        handler.use(async function (context) {
            return context.send({ value: 'test' });
        });
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.be.instanceOf(Object);
        expect(result.value).to.equal('test');
    });
});