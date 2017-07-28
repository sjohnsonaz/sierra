import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as http from 'http';
import * as express from 'express';

import { Application, Controller, middleware, route } from '../scripts/modules/Sierra';

describe('route decorator`', () => {
    it('should generate get routes', () => {
        class TestController extends Controller<express.Router, express.RequestHandler> {
            @route('get', '')
            get(req: express.Request, res: express.Response, next: express.NextFunction) {
            }
        }

        class TestApplication extends Application<express.Router, express.RequestHandler> {
            app: express.Express;

            constructor() {
                super();
                this.app = express();
                this.addController(new TestController());
            }

            buildRoute(controller: Controller<express.Router, express.RequestHandler>) {
                let expressRouter = express.Router();
                controller.build(expressRouter, (app, verb, name, middleware, method) => {
                    switch (verb) {
                        case 'all':
                            app.all(name, ...middleware, method);
                            break;
                        case 'get':
                            app.get(name, ...middleware, method);
                            break;
                        case 'post':
                            app.post(name, ...middleware, method);
                            break;
                        case 'put':
                            app.put(name, ...middleware, method);
                            break;
                        case 'delete':
                            app.delete(name, ...middleware, method);
                            break;
                        case 'patch':
                            app.patch(name, ...middleware, method);
                            break;
                        case 'options':
                            app.options(name, ...middleware, method);
                            break;
                        case 'head':
                            app.head(name, ...middleware, method);
                            break;
                    }
                });
                this.app.use('/api', expressRouter);
            }

            listen() {
                let server = http.createServer(app);
                server.listen(port);
                server.on('listening', () => {
                    chai.request('localhost:' + port)
                        .get('/test')
                        .end((err, res) => {
                            res.should.have.status(200);
                            server.close();
                        });
                });
            }
        }

        let testApplication = new TestApplication();
        let port = 3003;
        let app = testApplication.app;
        app.set('port', port);

        testApplication.init();
        testApplication.listen();
    });
});
