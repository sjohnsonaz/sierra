import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class RawDirective<T> extends ResponseDirective<T> {
    options!: RawDirectiveOptions;
    constructor(value: T, options?: Partial<RawDirectiveOptions>) {
        super(ResponseDirectiveType.Raw, value, options);
    }
}

export interface RawDirectiveOptions extends ResponseDirectiveOptions {
    contentType?: string;
}

/**
 * Returns a `RawDirective` object
 */
export function raw<T>(value: T, options?: Partial<RawDirectiveOptions>) {
    return new RawDirective(value, options);
}
