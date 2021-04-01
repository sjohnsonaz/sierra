import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class JsonDirective<T> extends ResponseDirective<T> {
    constructor(value: T, options?: ResponseDirectiveOptions) {
        super(ResponseDirectiveType.Json, value, options);
    }
}

/**
 * Returns a `JsonDirective` object
 */
export function json<T>(value: T, options?: ResponseDirectiveOptions) {
    return new JsonDirective(value, options);
}
