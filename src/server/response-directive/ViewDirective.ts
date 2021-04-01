import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class ViewDirective<T> extends ResponseDirective<T> {
    template: string;
    constructor(value: T, template: string, options?: ResponseDirectiveOptions) {
        super(ResponseDirectiveType.View, value, options);
        this.template = template;
    }
}

/**
 * Returns a `ViewDirective` object
 */
export function view<T>(value: T, template: string, options?: ResponseDirectiveOptions) {
    return new ViewDirective(value, template, options);
}
