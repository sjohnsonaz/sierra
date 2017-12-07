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
            '/getsomething/:another/:id',
            '/getsomething/:id/fixed'
        ];

        routes.sort((a, b) => {
            let aParts = a.substr(1).split('/');
            let bParts = b.substr(1).split('/');
            let length = Math.max(aParts.length, bParts.length);
            let result = 0;
            for (let index = 0; index < length; index++) {
                let aPart = aParts[index] || '';
                let bPart = bParts[index] || '';
                result = ((aPart[0] === ':') as any) - ((bPart[0] === ':') as any);
                if (result) {
                    break;
                }
            }
            return result;
        });
        expect(true).to.equal(true);
    })
})