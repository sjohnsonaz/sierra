import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as express from 'express';

import { Controller, middleware, route } from '../scripts/Sierra';
import TestApplication from './TestApplication';

describe('route decorator`', () => {
    it('should generate get routes', () => {
        class TestController extends Controller<express.Router, express.RequestHandler> {
            @route('get', '')
            get(req: express.Request, res: express.Response, next: express.NextFunction) {
            }
        }

        let port = 3003;
        let testApplication = new TestApplication({ port: port });
        testApplication.addController(new TestController());
        testApplication.init();
        testApplication.listen().then(() => {
            chai.request('localhost:' + port)
                .get('/test')
                .end((err, res) => {
                    res.should.have.status(200);
                    testApplication.close();
                });
        });
    });
});