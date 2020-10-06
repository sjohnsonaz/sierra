import { Color, } from "./ConsoleUtil"

describe('ConsoleUtil', function () {
    describe('Color', function () {
        it('should show black text', function () {
            const result = Color.black('text');
            const expected = '\x1b[' + 30 + 'm' + 'text' + '\x1b[39m';
            expect(result).toBe(expected);
        });

        it('should show white text', function () {
            const result = Color.white('text');
            const expected = '\x1b[' + 37 + 'm' + 'text' + '\x1b[39m';
            expect(result).toBe(expected);
        });
    });
});