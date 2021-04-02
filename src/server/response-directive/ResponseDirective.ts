import { Header } from '../header';
import { Directive } from '../../pipeline/directive';
import { ResponseDirectiveType } from './ResponseDirectiveType';

export class ResponseDirective<T> extends Directive<T> {
    options: ResponseDirectiveOptions;
    constructor(
        type: ResponseDirectiveType,
        value: T,
        { header = {}, status = 200, ...rest }: Partial<ResponseDirectiveOptions> = {}
    ) {
        super(type, value);
        this.options = { header, status, ...rest };
    }
}

export interface ResponseDirectiveOptions {
    status: number;
    header: Header;
}
