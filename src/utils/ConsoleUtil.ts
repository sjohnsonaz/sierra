export default class ConsoleUtil {
    // Colors
    static black(text: any) {
        return '\x1b[30m' + text + '\x1b[39m';
    }
    static red(text: any) {
        return '\x1b[31m' + text + '\x1b[39m';
    }
    static green(text: any) {
        return '\x1b[32m' + text + '\x1b[39m';
    }
    static yellow(text: any) {
        return '\x1b[33m' + text + '\x1b[39m';
    }
    static blue(text: any) {
        return '\x1b[34m' + text + '\x1b[39m';
    }
    static magenta(text: any) {
        return '\x1b[35m' + text + '\x1b[39m';
    }
    static cyan(text: any) {
        return '\x1b[36m' + text + '\x1b[39m';
    }
    static white(text: any) {
        return '\x1b[37m' + text + '\x1b[39m';
    }
    static gray(text: any) {
        return '\x1b[90m' + text + '\x1b[39m';
    }

    // Backgrounds
    static bgBlack(text: any) {
        return '\x1b[40m' + text + '\x1b[49m';
    }
    static bgRed(text: any) {
        return '\x1b[41m' + text + '\x1b[49m';
    }
    static bgGreen(text: any) {
        return '\x1b[42m' + text + '\x1b[49m';
    }
    static bgYellow(text: any) {
        return '\x1b[43m' + text + '\x1b[49m';
    }
    static bgBlue(text: any) {
        return '\x1b[44m' + text + '\x1b[49m';
    }
    static bgMagenta(text: any) {
        return '\x1b[45m' + text + '\x1b[49m';
    }
    static bgCyan(text: any) {
        return '\x1b[46m' + text + '\x1b[49m';
    }
    static bgWhite(text: any) {
        return '\x1b[47m' + text + '\x1b[49m';
    }

    // Styles
    static reset(text: any) {
        return '\x1b[0m' + text + '\x1b[0m';
    }
    static bold(text: any) {
        return '\x1b[1m' + text + '\x1b[22m';
    }
    static dim(text: any) {
        return '\x1b[2m' + text + '\x1b[22m';
    }
    static italic(text: any) {
        return '\x1b[3m' + text + '\x1b[23m';
    }
    static underline(text: any) {
        return '\x1b[4m' + text + '\x1b[24m';
    }
    static inverse(text: any) {
        return '\x1b[7m' + text + '\x1b[27m';
    }
    static hidden(text: any) {
        return '\x1b[8m' + text + '\x1b[28m';
    }
    static strikethrough(text: any) {
        return '\x1b[9m' + text + '\x1b[29m';
    }
}