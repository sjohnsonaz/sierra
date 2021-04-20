import { createRequest } from '../utils/test';

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
            expect(context.method).toBe(request.method?.toLowerCase());
            expect(context.contentType.mediaType).toBe('application/json');
            expect(context.accept).toStrictEqual(['application/json']);
        });

        it('should initialize httpBoundary', function () {
            const [request, response] = createRequest({
                headers: {
                    'content-type': 'multipart/form-data; boundary=something',
                },
            });
            const context = new Context(request, response);
            expect(context.contentType.boundary).toBe('something');
        });

        it('should ignore improper httpBoundary', function () {
            const [request, response] = createRequest({
                headers: {
                    'content-type': 'multipart/form-data; boundary',
                },
            });
            const context = new Context(request, response);
            expect(context.contentType.boundary).toBe(undefined);
        });
    });

    describe.skip('getContentType', function () {
        it('should handle falsey', function () {});

        it('should handle media-type', function () {});

        it('should handle charset', function () {});

        it('should handle boundary', function () {});
    });

    describe.skip('getAccept', function () {
        it('should handle falsey', function () {});

        it('should handle one', function () {});

        it('should handle multiple', function () {});
    });
});
