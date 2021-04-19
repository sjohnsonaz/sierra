import { RawDirective, raw } from './RawDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('RawDirective', function () {
    describe('raw', function () {
        it('should create an RawDirective', function () {
            const result = raw('data');
            const { type, value, options } = result;

            expect(result).toBeInstanceOf(RawDirective);
            expect(type).toBe(ResponseDirectiveType.Raw);
            expect(value).toBe('data');
            expect(options.status).toBe(200);
        });
    });
});
