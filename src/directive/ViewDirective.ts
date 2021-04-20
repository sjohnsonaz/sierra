import { ResponseDirective, ResponseDirectiveOptions } from './ResponseDirective';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class ViewDirective<T> extends ResponseDirective<T> {
    options!: ViewDirectiveOptions;
    constructor(value: T, { template = 'index', ...rest }: Partial<ViewDirectiveOptions> = {}) {
        super(ResponseDirectiveType.View, value, { template, ...rest } as ResponseDirectiveOptions);
    }
}

interface ViewDirectiveOptions extends ResponseDirectiveOptions {
    template: string;
}

/**
 * Returns a `ViewDirective` object
 */
export function view<T>(value: T, options?: Partial<ViewDirectiveOptions>) {
    return new ViewDirective(value, options);
}
