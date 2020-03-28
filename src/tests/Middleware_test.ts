import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, route, Context, middleware } from '../scripts/Sierra';

describe('middleware decorator', () => {
    let port = 3001;
    let application: Sierra;

    before(async () => {
        class TestController extends Controller {
            @middleware(async (_context) => {
                return false;
            })
            @middleware(async (_context) => {
                return true;
            })
            @route('get')
            async get(_context: Context, value: boolean) {
                return { value: value };
            }

            @middleware(async (_context) => {
                return { a: 1 };
            })
            @middleware(async (_context, value: any) => {
                value.b = 2;
                return value;
            })
            @route('post')
            async post(_context: Context, value: any) {
                return value;
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        application.init();
        await application.listen(port);
    });

    it('should run in order', async () => {
        let res = await chai.request('localhost:' + port)
            .get('/test');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.be.instanceOf(Object);
        expect(result.value).to.equal(true);
    });

    it('should run all middlewares', async () => {
        let res = await chai.request('localhost:' + port)
            .post('/test');
        expect(res).to.be.json;
        let result = JSON.parse(res.text);
        expect(result).to.be.instanceOf(Object);
        expect(result.a).to.equal(1);
        expect(result.b).to.equal(2);
    });

    after(async () => {
        await application.close();
    });
});