import { encode } from './Encode';
import { decode } from './Decode';

export function getQueryString(url: string) {
    const index = url.indexOf('?');
    if (index >= 0) {
        return url.substring(index + 1);
    } else {
        return '';
    }
}

export function updateUrlStringObject(url: string, obj: Object): string {
    const index = url.indexOf('?');
    const base = url.substring(0, index);
    url = url.substring(index + 1);
    const data = decode(url);
    const merged = Object.assign({}, data, obj);
    return base + '?' + encode(merged);
}
