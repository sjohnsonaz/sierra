import { ErrorDirective, error } from './ErrorDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('ErrorDirective', function () {
    describe('error', function () {
        it('should create an ErrorDirective', function () {
            const result = error(new Error('data'));
            const { type, value, options } = result;

            expect(result).toBeInstanceOf(ErrorDirective);
            expect(type).toBe(ResponseDirectiveType.Error);
            expect(value).toStrictEqual(new Error('data'));
            expect(options.status).toBe(500);
        });
    });
});
