import { HeaderName } from '../HeaderName';
import { Directive } from '../../pipeline/directive';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class ResponseDirective<T> extends Directive<T> {
    options?: ResponseDirectiveOptions;
    constructor(type: ResponseDirectiveType, value: T, options?: ResponseDirectiveOptions) {
        super(type, value);
        this.options = options;
    }
}

export interface ResponseDirectiveOptions {
    code?: number;
    headers?: Record<HeaderName, string>;
}
