import { HeaderName } from './HeaderName';

export type Header = {
    [Property in HeaderName]?: string;
};
