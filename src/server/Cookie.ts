import { IncomingMessage, ServerResponse } from 'http';

const SET_COOKIE = 'Set-Cookie';
const COOKIE = 'cookie';
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

abstract class CookieOptions {
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

export class CookieRegistry {
    incoming: Record<string, Cookie> = {};
    outgoing: Record<string, Cookie> = {};

    constructor(request: IncomingMessage) {
        const cookieHeader = request.headers[COOKIE];
        const hash = CookieRegistry.stringToHash(cookieHeader);
        Object.keys(hash).forEach(name => {
            const value = hash[name];
            this.incoming[name] = new Cookie(name, value);
            this.outgoing[name] = new Cookie(name, value);
        });
    }

    addCookie(
        name: string,
        value: string,
        options?: CookieOptions): Cookie;
    addCookie(cookie: Cookie): Cookie;
    addCookie(a: Cookie | string, value?: string, options?: CookieOptions): Cookie {
        if (a instanceof Cookie) {
            this.outgoing[a.name] = a;
            return a;
        } else {
            const cookie = new Cookie(a, value, options);
            this.outgoing[cookie.name] = cookie;
            return cookie;
        }
    }

    removeCookie(name: string) {
        delete this.outgoing[name];
    }

    getCookie(name: string): Cookie | undefined {
        return this.outgoing[name];
    }

    getOrCreateCookie(name: string) {
        let cookie = this.outgoing[name];
        if (!cookie) {
            cookie = new Cookie(name, '');
            this.outgoing[name] = cookie;
        }
        return cookie;
    }

    getCookies() {
        return Object.values(this.outgoing);
    }

    setCookies(response: ServerResponse) {
        const keyHash: Record<string, string> = {};
        Object.keys(this.incoming).forEach(key => keyHash[key] = key);
        Object.keys(this.outgoing).forEach(key => keyHash[key] = key);
        const cookies: string[] = [];
        Object.keys(keyHash).map(key => {
            const a = this.incoming[key];
            const b = this.outgoing[key];
            if (a) {
                if (b) {
                    // Compare
                    const aString = a.toString();
                    const bString = b.toString();
                    if (aString !== bString) {
                        cookies.push(bString);
                    }
                } else {
                    // Delete?
                }
            } else {
                // Create
                cookies.push(b.toString());
            }
        });
        response.setHeader(SET_COOKIE, cookies);
    }

    static stringToHash(cookieString: string) {
        const hash: Record<string, string> = {};
        if (cookieString) {
            cookieString.split(';')
                .forEach(entry => {
                    entry = entry.trim();
                    let parts = entry.split('=');
                    if (parts.length === 2 && parts[0] && parts[1]) {
                        hash[parts[0]] = parts[1];
                    }
                });
        }
        return hash;
    }
}
