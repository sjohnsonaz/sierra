import { TextDirective, text } from './TextDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('TextDirective', function () {
    describe('raw', function () {
        it('should create an TextDirective', function () {
            const result = text('data');
            const { type, value, options } = result;

            expect(result).toBeInstanceOf(TextDirective);
            expect(type).toBe(ResponseDirectiveType.Text);
            expect(value).toBe('data');
            expect(options.status).toBe(200);
        });
    });
});
