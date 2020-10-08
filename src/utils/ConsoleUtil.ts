const BACKGROUND_OFFSET = 10;

export enum ConsoleColor {
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

export enum ConsoleStyle {
    Reset = 0,
    Bold = 1,
    Dim = 2,
    Italic = 3,
    Underline = 4,
    Inverse = 7,
    Hidden = 8,
    Strikethrough = 9
}

export enum ConsoleEnd {
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

export namespace ConsoleFormat {
    export function character(value: number) {
        return '\x1b[' + value + 'm';
    }

    export function text(start: number, end: number, text: any) {
        return `${character(start)}${text}${character(end)}`;
    }

    export function color(color: ConsoleColor, value: any) {
        return text(color, ConsoleEnd.Color, value);
    }

    export function background(color: ConsoleColor, value: any) {
        return text(color + BACKGROUND_OFFSET, ConsoleEnd.Background, value);
    }
}

export namespace Color {
    export function black(value: any) {
        return ConsoleFormat.color(ConsoleColor.Black, value);
    }

    export function red(value: any) {
        return ConsoleFormat.color(ConsoleColor.Red, value);
    }

    export function green(value: any) {
        return ConsoleFormat.color(ConsoleColor.Green, value);
    }

    export function yellow(value: any) {
        return ConsoleFormat.color(ConsoleColor.Yellow, value);
    }

    export function blue(value: any) {
        return ConsoleFormat.color(ConsoleColor.Blue, value);
    }

    export function magenta(value: any) {
        return ConsoleFormat.color(ConsoleColor.Magenta, value);
    }

    export function cyan(value: any) {
        return ConsoleFormat.color(ConsoleColor.Cyan, value);
    }

    export function white(value: any) {
        return ConsoleFormat.color(ConsoleColor.White, value);
    }

    export function brightBlack(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightBlack, value);
    }

    export function brightRed(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightRed, value);
    }

    export function brightGreen(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightGreen, value);
    }

    export function brightYellow(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightYellow, value);
    }

    export function brightBlue(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightBlue, value);
    }

    export function brightMagenta(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightMagenta, value);
    }

    export function brightCyan(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightCyan, value);
    }

    export function brightWhite(value: any) {
        return ConsoleFormat.color(ConsoleColor.BrightWhite, value);
    }
}

export namespace Background {
    export function black(value: any) {
        return ConsoleFormat.background(ConsoleColor.Black, value);
    }

    export function red(value: any) {
        return ConsoleFormat.background(ConsoleColor.Red, value);
    }

    export function green(value: any) {
        return ConsoleFormat.background(ConsoleColor.Green, value);
    }

    export function yellow(value: any) {
        return ConsoleFormat.background(ConsoleColor.Yellow, value);
    }

    export function blue(value: any) {
        return ConsoleFormat.background(ConsoleColor.Blue, value);
    }

    export function magenta(value: any) {
        return ConsoleFormat.background(ConsoleColor.Magenta, value);
    }

    export function cyan(value: any) {
        return ConsoleFormat.background(ConsoleColor.Cyan, value);
    }

    export function white(value: any) {
        return ConsoleFormat.background(ConsoleColor.White, value);
    }

    export function brightBlack(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightBlack, value);
    }

    export function brightRed(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightRed, value);
    }

    export function brightGreen(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightGreen, value);
    }

    export function brightYellow(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightYellow, value);
    }

    export function brightBlue(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightBlue, value);
    }

    export function brightMagenta(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightMagenta, value);
    }

    export function brightCyan(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightCyan, value);
    }

    export function brightWhite(value: any) {
        return ConsoleFormat.background(ConsoleColor.BrightWhite, value);
    }
}

export namespace Style {
    export function reset(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Reset, ConsoleStyle.Reset, value);
    }

    export function bold(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Bold, ConsoleEnd.Bold, value);
    }

    // TODO: Test this
    export function dim(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Dim, ConsoleEnd.Bold, value);
    }

    export function italic(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Italic, ConsoleEnd.Italic, value);
    }

    export function underline(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Underline, ConsoleEnd.Underline, value);
    }

    export function inverse(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Inverse, ConsoleEnd.Inverse, value);
    }

    export function hidden(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Hidden, ConsoleEnd.Hidden, value);
    }

    export function strikethrough(value: any) {
        return ConsoleFormat.text(ConsoleStyle.Strikethrough, ConsoleEnd.Strikethrough, value);
    }
}