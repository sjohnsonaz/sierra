import { Context, OutgoingMessage } from '../Sierra';
import { createRequest } from '../utils/TestUtil';

describe('Context', function () {
    describe('constructor', function () {
        it('should initialize from IncomingMessage and ServerResponse', function () {
            const [request, response] = createRequest({
                method: 'get',
                url: 'http://localhost/test',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
            });
            const context = new Context(request, response);
            expect(context.request).toBe(request);
            expect(context.response).toBe(response);
            expect(context.method).toBe(request.method.toLowerCase());
            expect(context.contentType).toBe('application/json');
            expect(context.accept).toStrictEqual(['application/json']);
        });

        it('should initialize httpBoundary', function () {
            const [request, response] = createRequest({
                headers: {
                    'content-type': 'multipart/form-data; boundary=something'
                },
            });
            const context = new Context(request, response);
            expect(context.httpBoundary).toBe('something');
        });

        it('should ignore improper httpBoundary', function () {
            const [request, response] = createRequest({
                headers: {
                    'content-type': 'multipart/form-data; boundary'
                },
            });
            const context = new Context(request, response);
            expect(context.httpBoundary).toBe(undefined);
        });
    });

    describe('send', function () {
        it('should create an OutgoingMessage with default parameters', function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const data = { value: true };
            const result = context.send(data);
            expect(result).toBeInstanceOf(OutgoingMessage);
            expect(result.data).toBe(data);
            expect(result.status).toBe(200);
        });

        it('should create an OutgoingMessage', function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const data = { value: true };
            const status = 201;
            const result = context.send(data, status);
            expect(result).toBeInstanceOf(OutgoingMessage);
            expect(result.data).toBe(data);
            expect(result.status).toBe(status);
        });
    });

    describe.skip('getContentType', function () {
        it('should handle falsey', function () {

        });

        it('should handle media-type', function () {

        });

        it('should handle charset', function () {

        });

        it('should handle boundary', function () {

        });
    });

    describe.skip('getAccept', function () {
        it('should handle falsey', function () {

        });

        it('should handle one', function () {

        });

        it('should handle multiple', function () {

        });
    });
});
