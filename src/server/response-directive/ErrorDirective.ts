import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class ErrorDirective<T extends Error> extends ResponseDirective<T> {
    constructor(value: T, { status = 500, ...rest }: Partial<ResponseDirectiveOptions> = {}) {
        super(ResponseDirectiveType.Error, value, { status, ...rest });
    }
}

/**
 * Returns a `ErrorDirective` object
 */
export function error<T extends Error>(value: T, options?: Partial<ResponseDirectiveOptions>) {
    return new ErrorDirective(value, options);
}
