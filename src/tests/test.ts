import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as express from 'express';

import { Controller, middleware, route } from '../scripts/Sierra';
import TestApplication from './TestApplication';

describe('route decorator`', () => {
    it('should generate get routes', (done) => {
        class TestController extends Controller<express.Router, express.RequestHandler> {
            @route('get', '')
            get(req: express.Request, res: express.Response, next: express.NextFunction) {
            }
        }

        let port = 3003;
        let testApplication = new TestApplication({ port: port });
        testApplication.addController(new TestController());
        testApplication.init();
        testApplication.listen();
        chai.request('localhost:' + port)
            .get('/api/test')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    testApplication.close();
                    done(err);
                } else {
                    res.should.have.status(200);
                    testApplication.close();
                    done();
                }
            }).catch((err) => {
                done(err);
                testApplication.close();
            });
    });
});
