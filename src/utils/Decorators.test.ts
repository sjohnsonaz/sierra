import fetch from 'node-fetch';

import Sierra, { Controller, route, Context } from '../Sierra';

describe('route decorator', () => {
    const port = 3001;
    const url = `http://localhost:${port}`;
    let application: Sierra;

    beforeEach(async () => {
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


    afterEach(async () => {
        await application.close();
    });

    it('should generate get routes', async () => {
        const response = await fetch(`${url}/test`);
        expect(response.status).toBe(200);
    });
});