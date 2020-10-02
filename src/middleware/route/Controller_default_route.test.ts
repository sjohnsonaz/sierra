import fetch from 'node-fetch';

import Sierra, { Controller, route, Context } from '../../Sierra';

describe('Default route', () => {
    const port = 3001;
    const url = `http://localhost:${port}`;
    let application: Sierra;

    beforeEach(async function () {
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

    afterEach(async function () {
        await application.close();
    });

    it('should use default route', async function () {
        const response = await fetch(`${url}/`);
        expect(response.status).toBe(200);
    });
});