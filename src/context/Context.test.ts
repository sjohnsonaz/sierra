import { createRequest } from '@cardboardrobots/test-util';

import { Context } from './Context';

describe('Context', function () {
    describe('constructor', function () {
        it('should initialize from IncomingMessage and ServerResponse', function () {
            const [request, response] = createRequest({
                method: 'get',
                url: 'http://localhost/test',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const context = new Context(request, response);
            expect(context.request).toBe(request);
            expect(context.response).toBe(response);
            expect(context.data).toStrictEqual({});
        });
    });
});
