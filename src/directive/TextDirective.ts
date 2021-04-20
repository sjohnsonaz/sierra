import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class TextDirective<T> extends ResponseDirective<T> {
    constructor(value: T, options?: Partial<ResponseDirectiveOptions>) {
        super(ResponseDirectiveType.Text, value, options);
    }
}

/**
 * Returns a `TextDirective` object
 */
export function text<T>(value: T, options?: Partial<ResponseDirectiveOptions>) {
    return new TextDirective(value, options);
}
