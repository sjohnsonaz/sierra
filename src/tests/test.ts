import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as express from 'express';

import { Controller, middleware, route } from '../scripts/Sierra';
import { wait } from '../scripts/utils/TestUtil';
import TestApplication from './TestApplication';

describe('route decorator`', () => {
    it('should generate get routes', async () => {
        class TestController extends Controller<express.Router, express.RequestHandler> {
            @route('get', '')
            get(req: express.Request, res: express.Response, next: express.NextFunction) {
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ value: true }));
            }
        }

        let port = 3003;
        let testApplication = new TestApplication({ port: port });
        testApplication.addController(new TestController());
        testApplication.init();
        await testApplication.listen();
        await wait(0);
        try {
            chai.request('localhost:' + port)
                .get('/test')
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                });
        } catch (e) {

        } finally {
            testApplication.close().then(() => {
            });
        }
    });
});