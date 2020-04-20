import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as http from 'http';
import * as fs from 'fs';

import Handlebars from 'handlebars';

import RequestHandler from './RequestHandler';

describe('RequestHandler', function () {
    let handler = new RequestHandler();

    handler.use(async function (context) {
        return context.send({ value: 'test' });
    });

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

    let port = 3001;
    let server = http.createServer(handler.callback);

    before(async function () {
        await new Promise((resolve, reject) => {
            server.listen(port, () => {
                resolve();
            }).on('error', (e) => {
                reject(e);
            });
        });
    });

    after(async function () {
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
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.be.instanceOf(Object);
        expect(result.value).to.equal('test');
    });
});