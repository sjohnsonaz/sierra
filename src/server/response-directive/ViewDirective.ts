import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class ViewDirective<T> extends ResponseDirective<T> {
    options!: ViewDirectiveOptions;
    constructor(value: T, options: ViewDirectiveOptionsPartial) {
        super(ResponseDirectiveType.View, value, options);
    }
}

interface ViewDirectiveOptions extends ResponseDirectiveOptions {
    template: string;
}

interface ViewDirectiveOptionsPartial extends Partial<ResponseDirectiveOptions> {
    template: string;
}

/**
 * Returns a `ViewDirective` object
 */
export function view<T>(value: T, options: ViewDirectiveOptionsPartial) {
    return new ViewDirective(value, options);
}
