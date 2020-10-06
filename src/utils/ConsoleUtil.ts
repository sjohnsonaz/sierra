const RESET = 0;
const BACKGROUND_OFFSET = 10;

enum ConsoleColor {
    Black = 30,
    Red = 31,
    Green = 32,
    Yellow = 33,
    Blue = 34,
    Magenta = 35,
    Cyan = 36,
    White = 37,
    BrightBlack = 90,
    BrightRed = 91,
    BrightGreen = 92,
    BrightYellow = 93,
    BrightBlue = 94,
    BrightMagenta = 95,
    BrightCyan = 96,
    BrightWhite = 97
}

enum ConsoleStyle {
    Bold = 1,
    Dim = 2,
    Italic = 3,
    Underline = 4,
    Inverse = 7,
    Hidden = 8,
    Strikethrough = 9
}

enum ConsoleEnd {
    Bold = 22,
    Italic = 23,
    Underline = 24,
    Blink = 25,
    Inverse = 27,
    Hidden = 28,
    Strikethrough = 29,
    Color = 39,
    Background = 49
}

function character(value: number) {
    return '\x1b[' + value + 'm';
}

function text(start: number, end: number, text: any) {
    return `${character(start)}${text}${character(end)}`;
}

export namespace Color {
    function color(color: ConsoleColor, value: any) {
        return text(color, ConsoleEnd.Color, value);
    }

    export function black(value: any) {
        return color(ConsoleColor.Black, value);
    }

    export function red(value: any) {
        return color(ConsoleColor.Red, value);
    }

    export function green(value: any) {
        return color(ConsoleColor.Green, value);
    }

    export function yellow(value: any) {
        return color(ConsoleColor.Yellow, value);
    }

    export function blue(value: any) {
        return color(ConsoleColor.Blue, value);
    }

    export function magenta(value: any) {
        return color(ConsoleColor.Magenta, value);
    }

    export function cyan(value: any) {
        return color(ConsoleColor.Cyan, value);
    }

    export function white(value: any) {
        return color(ConsoleColor.White, value);
    }

    export function gray(value: any) {
        return color(ConsoleColor.BrightBlack, value);
    }
}

export namespace Background {
    function background(color: ConsoleColor, value: any) {
        return text(color + BACKGROUND_OFFSET, ConsoleEnd.Background, value);
    }

    export function black(value: any) {
        return background(ConsoleColor.Black, value);
    }

    export function red(value: any) {
        return background(ConsoleColor.Red, value);
    }

    export function green(value: any) {
        return background(ConsoleColor.Green, value);
    }

    export function yellow(value: any) {
        return background(ConsoleColor.Yellow, value);
    }

    export function blue(value: any) {
        return background(ConsoleColor.Blue, value);
    }

    export function magenta(value: any) {
        return background(ConsoleColor.Magenta, value);
    }

    export function cyan(value: any) {
        return background(ConsoleColor.Cyan, value);
    }

    export function white(value: any) {
        return background(ConsoleColor.White, value);
    }
}

export namespace style {
    export function reset(value: any) {
        return text(RESET, RESET, value);
    }

    export function bold(value: any) {
        return text(ConsoleStyle.Bold, ConsoleEnd.Bold, value);
    }

    // TODO: Test this
    export function dim(value: any) {
        return text(ConsoleStyle.Dim, ConsoleEnd.Bold, value);
    }

    export function italic(value: any) {
        return text(ConsoleStyle.Italic, ConsoleEnd.Italic, value);
    }

    export function underline(value: any) {
        return text(ConsoleStyle.Underline, ConsoleEnd.Underline, value);
    }

    export function inverse(value: any) {
        return text(ConsoleStyle.Inverse, ConsoleEnd.Inverse, value);
    }

    export function hidden(value: any) {
        return text(ConsoleStyle.Hidden, ConsoleEnd.Hidden, value);
    }

    export function strikethrough(value: any) {
        return text(ConsoleStyle.Strikethrough, ConsoleEnd.Strikethrough, value);
    }
}