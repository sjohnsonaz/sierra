import { ViewDirective, view } from './ViewDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('ViewDirective', function () {
    describe('raw', function () {
        it('should create an ViewDirective', function () {
            const result = view('data', { template: 'template' });
            const { type, value, options } = result;

            expect(result).toBeInstanceOf(ViewDirective);
            expect(type).toBe(ResponseDirectiveType.View);
            expect(value).toBe('data');
            expect(options.status).toBe(200);
            expect(options.template).toBe('template');
        });
    });
});
