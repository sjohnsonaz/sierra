import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class AutoDirective<T> extends ResponseDirective<T> {
    options!: AutoDirectiveOptions;
    constructor(value: T, options?: Partial<AutoDirectiveOptions>) {
        super(ResponseDirectiveType.Auto, value, options);
    }
}

interface AutoDirectiveOptions extends ResponseDirectiveOptions {
    template: string;
}

/**
 * Returns a `AutoDirective` object
 */
export function auto<T>(value: T, options?: Partial<AutoDirectiveOptions>) {
    return new AutoDirective(value, options);
}
