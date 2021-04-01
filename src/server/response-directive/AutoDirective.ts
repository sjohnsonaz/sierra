import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class AutoDirective<T> extends ResponseDirective<T> {
    constructor(value: T, options?: Partial<ResponseDirectiveOptions>) {
        super(ResponseDirectiveType.Auto, value, options);
    }
}

/**
 * Returns a `AutoDirective` object
 */
export function auto<T>(value: T, options?: Partial<ResponseDirectiveOptions>) {
    return new AutoDirective(value, options);
}
