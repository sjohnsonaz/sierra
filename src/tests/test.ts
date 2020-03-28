import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra, { Controller, route, Context } from '../scripts/Sierra';

describe('route decorator', () => {
    let port = 3001;
    let application: Sierra;

    before(async () => {
        class TestController extends Controller {
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

    it('should generate get routes', async () => {
        let res = await chai.request('localhost:' + port)
            .get('/test');
        expect(res).to.have.status(200);
    });

    after(async () => {
        await application.close();
    });
});

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