import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, middleware, route, Context } from '../scripts/Sierra';
import { wait } from '../scripts/utils/TestUtil';

describe('route decorator`', () => {
    it('should generate get routes', async () => {
        class TestController extends Controller {
            @route('get', '')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        let port = 3003;
        let testApplication = new Sierra();
        testApplication.addController(new TestController());
        testApplication.init();
        await testApplication.listen(port);
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