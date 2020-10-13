import * as http from 'http';
import { createRequest, wait } from './TestUtil';

describe('TestUtil', function () {
    describe('wait', function () {
        it('should pause for a secified timeout', async function () {
            await wait(0);
        });
    });

    describe('createRequest', function () {
        it('should create an http.IncomingMessage and http.ServerResponse tuple', function () {
            const [request, response] = createRequest();
            expect(request).toBeInstanceOf(http.IncomingMessage);
            expect(response).toBeInstanceOf(http.ServerResponse);
        });

        it('should copy properties from RequestInfo', function () {
            const [request] = createRequest({
                method: 'get',
                url: 'http://localhost'
            });
            expect(request.method).toBe('get');
            expect(request.url).toBe('http://localhost');
        });
    })
});
