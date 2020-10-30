const DOMAIN = 'Domain';
const EXPIRES = 'Expires';
const MAX_AGE = 'Max-Age';
const PATH = 'Path';
const SECURE = 'Secure';
const HTTP_ONLY = 'HttpOnly';
const SAME_SITE = 'SameSite';

export enum SameSite {
    None = 'None',
    Strict = 'Strict',
    Lax = 'Lax'
}

export type SameSiteType =
    SameSite |
    'None' |
    'Strict' |
    'Lax';

export abstract class CookieOptions {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: SameSiteType;
}

export class Cookie extends CookieOptions {
    name: string;
    value: string;

    constructor(
        name: string,
        value: string,
        {
            expires,
            maxAge,
            path,
            domain,
            secure,
            httpOnly,
            sameSite
        }: CookieOptions = {}
    ) {
        super();
        this.name = name;
        this.value = value;
        this.expires = expires;
        this.maxAge = maxAge;
        this.path = path;
        this.domain = domain;
        this.secure = secure;
        this.httpOnly = httpOnly;
        this.sameSite = sameSite;
    }

    toString() {
        const parts: string[] = [getEntry(
            encodeURIComponent(this.name),
            encodeURIComponent(this.value)
        )];
        if (this.expires) {
            parts.push(getEntry(
                EXPIRES, this.expires.toUTCString()
            ));
        }
        if (typeof this.maxAge === 'number') {
            parts.push(getEntry(
                MAX_AGE, this.maxAge.toString()
            ));
        }
        if (this.path) {
            parts.push(getEntry(
                PATH, this.path
            ));
        }
        if (this.domain) {
            parts.push(getEntry(
                DOMAIN, this.domain
            ));
        }
        if (this.secure) {
            parts.push(getEntry(SECURE));
        }
        if (this.httpOnly) {
            parts.push(getEntry(HTTP_ONLY));
        }
        if (this.sameSite) {
            parts.push(getEntry(
                SAME_SITE, this.sameSite
            ));
        }
        return parts.join('; ');
    }
}

function getEntry(key: string, value?: string) {
    if (value !== undefined) {
        return `${key}=${value}`;
    } else {
        return key;
    }
}

