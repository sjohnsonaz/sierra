import { AutoDirective, auto } from './AutoDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('AutoDirective', function () {
    describe('auto', function () {
        it('should create an AutoDirective', function () {
            const result = auto('data');
            const { type, value, options } = result;

            expect(result).toBeInstanceOf(AutoDirective);
            expect(type).toBe(ResponseDirectiveType.Auto);
            expect(value).toBe('data');
            expect(options.status).toBe(200);
        });
    });
});
