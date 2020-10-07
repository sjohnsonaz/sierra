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

    describe('setResponseHeader', function () {
        it('should set response header', function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const contentTypeName = 'Content-Type';
            const applicationJson = 'application/json';

            const contentTypeBefore = response.getHeader(contentTypeName);
            expect(contentTypeBefore).toBeUndefined();

            context.setResponseHeader(contentTypeName, applicationJson);

            const contentType = response.getHeader(contentTypeName);
            expect(contentType).toBe(applicationJson);
        });
    });

    describe('getResponseHeader', function () {
        it('should set response header', function () {
            const [request, response] = createRequest();
            const context = new Context(request, response);
            const contentTypeName = 'Content-Type';
            const applicationJson = 'application/json';

            context.setResponseHeader(contentTypeName, applicationJson);

            const contentType = context.getResponseHeader(contentTypeName);

            expect(contentType).toBe(applicationJson);
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
});
