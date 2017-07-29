import * as express from 'express';

import { Controller, middleware, route } from './scripts/Sierra';
import TestApplication from './tests/TestApplication';

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
testApplication.listen();