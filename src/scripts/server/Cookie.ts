import Context from './Context';

import { ICookieHash } from './ICookieHash';

export default class Cookie {
    _data: ICookieHash;
    static identifier: string = 'sierra_id';

    constructor(cookieString: string) {
        this._data = Cookie.stringToHash(cookieString);
    }

    get id(): string {
        return this._data[Cookie.identifier];
    }

    set id(value: string) {
        this._data[Cookie.identifier] = value;
    }

    get expires(): string {
        return this._data['Expires'];
    }

    set expires(value: string) {
        this._data['Expires'] = value;
    }

    get domain(): string {
        return this._data['Domain'];
    }

    set domain(value: string) {
        this._data['Domain'] = value;
    }

    get path(): string {
        return this._data['Path'];
    }

    set path(value: string) {
        this._data['Path'] = value;
    }

    /*
    get httpOnly(): boolean {
        return !!this._data['HttpOnly'];
    }

    set httpOnly(value: boolean) {
        if (value) {
            this._data['HttpOnly'] = 'true';
        } else {
            delete this._data['HttpOnly'];
        }
    }
    */

    static stringToHash(cookieString: string) {
        let entries = cookieString ? cookieString.split(';').map(entry => entry.trim()) : [];
        let hash: ICookieHash = {};
        entries.forEach(entry => {
            let parts = entry.split('=');
            if (parts.length === 2 && parts[0] && parts[1]) {
                hash[parts[0]] = parts[1];
            }
        });
        return hash;
    }

    static hashToCookie(hash: ICookieHash) {
        return Object.keys(hash).map(name => name + '=' + hash[name] + ';').join(' ');
    }

    static hashToCookieArray(hash: ICookieHash) {
        return Object.keys(hash).map(name => name + '=' + hash[name]);
    }

    static getCookie(context: Context) {
        return Cookie.stringToHash(context.request.headers.cookie);
    }

    static setCookie(context: Context, hash: ICookieHash) {
        context.response.setHeader('Set-Cookie', Cookie.hashToCookie(hash));
    }
}