import { DirectiveType } from './DirectiveType';
import { Directive } from './Directive';

export class ExitDirective<T> extends Directive<T> {
    constructor(value: T) {
        super(DirectiveType.Exit, value);
    }
}

/**
 * Returns a `ExitDirective` object
 */
export function exit<T>(value: T) {
    return new ExitDirective(value);
}
