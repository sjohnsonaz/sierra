import { DirectiveType } from './DirectiveType';
import { Directive } from './Directive';

type CaptureCallback<T extends Directive<any> = Directive<any>> = (context: T) => Promise<T>;

export class CaptureDirective<
    T extends Directive<any> = Directive<any>,
    U extends CaptureCallback<T> = CaptureCallback<T>
> extends Directive<U> {
    constructor(value: U) {
        super(DirectiveType.Capture, value);
    }
}

/**
 * Returns a `CaptureDirective` object
 */
export function capture<T extends Directive<any> = Directive<any>, U extends CaptureCallback<T> = CaptureCallback<T>>(
    value: U
) {
    return new CaptureDirective<T, U>(value);
}
