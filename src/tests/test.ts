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
            service = true;

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
            await new Promise((resolve, reject) => {
                chai.request('localhost:' + port)
                    .get('/api/test')
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            expect(res).to.have.status(200);
                            resolve(true);
                        }
                    });
            });
        } catch (e) {
            expect(e).to.be.null;
        } finally {
            await testApplication.close();
        }
    });
});