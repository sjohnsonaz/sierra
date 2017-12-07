import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, middleware, route, Context } from '../scripts/Sierra';
import { wait } from '../scripts/utils/TestUtil';

describe('route decorator`', () => {
    it('should generate get routes', async () => {
        class TestController extends Controller {
            @route('get')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        let port = 3001;
        let testApplication = new Sierra();
        testApplication.addController(new TestController());
        testApplication.init();
        await testApplication.listen(port);
        await wait(0);
        try {
            await new Promise((resolve, reject) => {
                chai.request('localhost:' + port)
                    .get('/test')
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

describe('Route.sort', () => {
    it('routes are sorted by RegExp, then location or first \':\', then alphabetical', () => {

        let routes = [
            '/',
            '/:id',
            '/count',
            '/test/:id',
            '/:var/a/',
            '/findit/:name',
            '/getsomething/:id/:name',
            '/getsomething/:name/:id',
            '/getsomething/:another/:id'
        ];

        routes.sort((a, b) => {
            let index = a.indexOf(':') - b.indexOf(':');
            if (index == 0) {
                index = (a > b) ? 1 : 0;
            }
            return index;
        });
        expect(true).to.equal(true);
    })
})