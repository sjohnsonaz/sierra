import { ResponseDirective } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

describe('ResponseDirective', function () {
    describe('constructor', function () {
        it('should initialize default properties', function () {
            const { type, value, options } = new ResponseDirective(
                ResponseDirectiveType.Auto,
                'data'
            );
            expect(type).toBe('auto');
            expect(value).toBe('data');
            expect(options.status).toBe(200);
        });

        it('should initialize all properties', function () {
            const { type, value, options } = new ResponseDirective(
                ResponseDirectiveType.Json,
                'data',
                {
                    status: 500,
                    header: { 'Content-Type': 'application/json' },
                }
            );
            expect(type).toBe('json');
            expect(value).toBe('data');
            expect(options.status).toBe(500);
            expect(options.header).toStrictEqual({ 'Content-Type': 'application/json' });
        });
    });
});
