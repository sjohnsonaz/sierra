import { Color, Background, Style, ConsoleColor, ConsoleEnd, ConsoleFormat, ConsoleStyle } from "./ConsoleUtil"

describe('ConsoleUtil', function () {
    const BACKGROUND_OFFSET = 10;

    describe('ConsoleFormat', function () {
        describe('character', function () {
            it('should create a format escape character', function () {
                const result = ConsoleFormat.character(0);
                const expected = '\x1b[' + 0 + 'm';
                expect(result).toBe(expected);
            });
        });

        describe('text', function () {
            it('should create a format wrapped string', function () {
                const result = ConsoleFormat.text(0, 1, 'text');
                const expected = '\x1b[' + 0 + 'm' + 'text' + '\x1b[' + 1 + 'm';
                expect(result).toBe(expected);
            });
        });

        describe('color', function () {
            it('should create a color formatted text', function () {
                const result = ConsoleFormat.color(ConsoleColor.Black, 'text');
                const expected = '\x1b[' + ConsoleColor.Black + 'm' + 'text' + '\x1b[' + ConsoleEnd.Color + 'm';
                expect(result).toBe(expected);
            });
        });

        describe('background', function () {
            it('should create a background formatted text', function () {
                const result = ConsoleFormat.background(ConsoleColor.Black, 'text');
                const expected = '\x1b[' + (ConsoleColor.Black + BACKGROUND_OFFSET) + 'm' + 'text' + '\x1b[' + ConsoleEnd.Background + 'm';
                expect(result).toBe(expected);
            });
        });
    });

    describe('Color', function () {
        it('should show black text', function () {
            const result = Color.black('text');
            const expected = ConsoleFormat.color(ConsoleColor.Black, 'text');
            expect(result).toBe(expected);
        });

        it('should show red text', function () {
            const result = Color.red('text');
            const expected = ConsoleFormat.color(ConsoleColor.Red, 'text');
            expect(result).toBe(expected);
        });

        it('should show green text', function () {
            const result = Color.green('text');
            const expected = ConsoleFormat.color(ConsoleColor.Green, 'text');
            expect(result).toBe(expected);
        });

        it('should show yellow text', function () {
            const result = Color.yellow('text');
            const expected = ConsoleFormat.color(ConsoleColor.Yellow, 'text');
            expect(result).toBe(expected);
        });

        it('should show blue text', function () {
            const result = Color.blue('text');
            const expected = ConsoleFormat.color(ConsoleColor.Blue, 'text');
            expect(result).toBe(expected);
        });

        it('should show magenta text', function () {
            const result = Color.magenta('text');
            const expected = ConsoleFormat.color(ConsoleColor.Magenta, 'text');
            expect(result).toBe(expected);
        });

        it('should show cyan text', function () {
            const result = Color.cyan('text');
            const expected = ConsoleFormat.color(ConsoleColor.Cyan, 'text');
            expect(result).toBe(expected);
        });

        it('should show white text', function () {
            const result = Color.white('text');
            const expected = ConsoleFormat.color(ConsoleColor.White, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright black text', function () {
            const result = Color.brightBlack('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightBlack, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright red text', function () {
            const result = Color.brightRed('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightRed, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright green text', function () {
            const result = Color.brightGreen('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightGreen, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright yellow text', function () {
            const result = Color.brightYellow('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightYellow, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright blue text', function () {
            const result = Color.brightBlue('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightBlue, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright magenta text', function () {
            const result = Color.brightMagenta('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightMagenta, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright cyan text', function () {
            const result = Color.brightCyan('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightCyan, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright white text', function () {
            const result = Color.brightWhite('text');
            const expected = ConsoleFormat.color(ConsoleColor.BrightWhite, 'text');
            expect(result).toBe(expected);
        });
    });

    describe('Background', function () {
        it('should show black background', function () {
            const result = Background.black('text');
            const expected = ConsoleFormat.background(ConsoleColor.Black, 'text');
            expect(result).toBe(expected);
        });

        it('should show red background', function () {
            const result = Background.red('text');
            const expected = ConsoleFormat.background(ConsoleColor.Red, 'text');
            expect(result).toBe(expected);
        });

        it('should show green background', function () {
            const result = Background.green('text');
            const expected = ConsoleFormat.background(ConsoleColor.Green, 'text');
            expect(result).toBe(expected);
        });

        it('should show yellow background', function () {
            const result = Background.yellow('text');
            const expected = ConsoleFormat.background(ConsoleColor.Yellow, 'text');
            expect(result).toBe(expected);
        });

        it('should show blue background', function () {
            const result = Background.blue('text');
            const expected = ConsoleFormat.background(ConsoleColor.Blue, 'text');
            expect(result).toBe(expected);
        });

        it('should show magenta background', function () {
            const result = Background.magenta('text');
            const expected = ConsoleFormat.background(ConsoleColor.Magenta, 'text');
            expect(result).toBe(expected);
        });

        it('should show cyan background', function () {
            const result = Background.cyan('text');
            const expected = ConsoleFormat.background(ConsoleColor.Cyan, 'text');
            expect(result).toBe(expected);
        });

        it('should show white background', function () {
            const result = Background.white('text');
            const expected = ConsoleFormat.background(ConsoleColor.White, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright black background', function () {
            const result = Background.brightBlack('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightBlack, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright red background', function () {
            const result = Background.brightRed('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightRed, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright green background', function () {
            const result = Background.brightGreen('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightGreen, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright yellow background', function () {
            const result = Background.brightYellow('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightYellow, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright blue background', function () {
            const result = Background.brightBlue('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightBlue, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright magenta background', function () {
            const result = Background.brightMagenta('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightMagenta, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright cyan background', function () {
            const result = Background.brightCyan('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightCyan, 'text');
            expect(result).toBe(expected);
        });

        it('should show bright white background', function () {
            const result = Background.brightWhite('text');
            const expected = ConsoleFormat.background(ConsoleColor.BrightWhite, 'text');
            expect(result).toBe(expected);
        });
    });

    describe('Style', function () {
        it('should reset formatting', function () {
            const result = Style.reset('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Reset, ConsoleStyle.Reset, 'text');
            expect(result).toBe(expected);
        });

        it('should show bold text', function () {
            const result = Style.bold('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Bold, ConsoleEnd.Bold, 'text');
            expect(result).toBe(expected);
        });

        it('should show dim text', function () {
            const result = Style.dim('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Dim, ConsoleEnd.Bold, 'text');
            expect(result).toBe(expected);
        });

        it('should show italic text', function () {
            const result = Style.italic('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Italic, ConsoleEnd.Italic, 'text');
            expect(result).toBe(expected);
        });

        it('should show underline text', function () {
            const result = Style.underline('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Underline, ConsoleEnd.Underline, 'text');
            expect(result).toBe(expected);
        });

        it('should show inverse text', function () {
            const result = Style.inverse('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Inverse, ConsoleEnd.Inverse, 'text');
            expect(result).toBe(expected);
        });

        it('should show hidden text', function () {
            const result = Style.hidden('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Hidden, ConsoleEnd.Hidden, 'text');
            expect(result).toBe(expected);
        });

        it('should show strikethrough text', function () {
            const result = Style.strikethrough('text');
            const expected = ConsoleFormat.text(ConsoleStyle.Strikethrough, ConsoleEnd.Strikethrough, 'text');
            expect(result).toBe(expected);
        });
    });
});
