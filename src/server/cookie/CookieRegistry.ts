import { IncomingMessage, ServerResponse } from 'http';

import { Cookie, CookieOptions } from "./Cookie";

const SET_COOKIE = 'Set-Cookie';
const COOKIE = 'cookie';

export class CookieRegistry {
    incoming: Record<string, Cookie> = {};
    outgoing: Record<string, Cookie> = {};

    constructor(request: IncomingMessage) {
        const cookieHeader = request.headers[COOKIE];
        if (cookieHeader) {
            const hash = CookieRegistry.stringToHash(cookieHeader);
            Object.keys(hash).forEach(name => {
                const value = hash[name];
                this.incoming[name] = new Cookie(name, value);
                this.outgoing[name] = new Cookie(name, value);
            });
        }
    }

    addCookie(
        name: string,
        value: string,
        options?: CookieOptions): Cookie;
    addCookie(cookie: Cookie): Cookie;
    addCookie(a: Cookie | string, value: string = '', options?: CookieOptions): Cookie {
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
        // TODO: Merge Set-Cookie Header
        // const setCookieHeader = response.getHeader(SET_COOKIE);
        // if (setCookieHeader) {
        //     if (setCookieHeader instanceof Array) {

        //     } else {

        //     }
        // }
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
