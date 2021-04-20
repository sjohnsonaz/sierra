import { createServer } from './createServer';
import { PromiseServer } from './PromiseServer';

describe('createServer', function () {
    it('should create a PromiseServer', function () {
        const result = createServer(() => {});
        expect(result).toBeInstanceOf(PromiseServer);
    });
});
