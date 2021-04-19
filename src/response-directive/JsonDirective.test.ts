import { JsonDirective, json } from './JsonDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('JsonDirective', function () {
    describe('json', function () {
        it('should create an JsonDirective', function () {
            const result = json('data');
            const { type, value, options } = result;

            expect(result).toBeInstanceOf(JsonDirective);
            expect(type).toBe(ResponseDirectiveType.Json);
            expect(value).toBe('data');
            expect(options.status).toBe(200);
        });
    });
});
