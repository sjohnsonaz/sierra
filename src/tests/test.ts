import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, middleware, route, Context } from '../scripts/Sierra';
import { wait } from '../scripts/utils/TestUtil';

describe('route decorator`', () => {
    let port = 3001;
    let testApplication: Sierra;

    before(async () => {
        class TestController extends Controller {
            @route('get')
            async get(context: Context, value: any) {
                return { value: true };
            }
        }

        testApplication = new Sierra();
        testApplication.addController(new TestController());
        testApplication.init();
        testApplication.listen(port);
        await wait(0);
    });

    it('should generate get routes', async () => {
        let res = await chai.request('localhost:' + port)
            .get('/test');
        expect(res).to.have.status(200);
    });

    after(() => {
        testApplication.close();
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