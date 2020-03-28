import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, route, Context } from '../scripts/Sierra';

describe('Default route', () => {
    let port = 3001;
    let application: Sierra;

    before(async () => {
        class TestController extends Controller {
            constructor() {
                super('/');
            }

            @route('get')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        application = new Sierra();
        application.addController(new TestController());
        application.init();
        await application.listen(port);
    });

    it('should use default route', async () => {
        let res = await chai.request('localhost:' + port)
            .get('/');
        expect(res).to.have.status(200);
    });

    after(async () => {
        await application.close();
    });
});