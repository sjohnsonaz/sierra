import { Cookie, SameSite } from './Cookie';

describe('Cookie', function () {
    describe('constructor', function () {
        it('should set default values', function () {
            const cookie = new Cookie('name', 'value');
            expect(cookie.name).toBe('name');
            expect(cookie.value).toBe('value');
            expect(cookie.expires).toBeUndefined();
            expect(cookie.maxAge).toBeUndefined();
            expect(cookie.path).toBeUndefined();
            expect(cookie.domain).toBeUndefined();
            expect(cookie.secure).toBeUndefined();
            expect(cookie.httpOnly).toBeUndefined();
            expect(cookie.sameSite).toBeUndefined();
        });

        it('should set all properties', function () {
            const date = new Date();
            const cookie = new Cookie('name', 'value', {
                expires: date,
                maxAge: 1,
                path: '/',
                domain: 'localhost',
                secure: true,
                httpOnly: true,
                sameSite: SameSite.None
            });
            expect(cookie.name).toBe('name');
            expect(cookie.value).toBe('value');
            expect(cookie.expires).toBe(date);
            expect(cookie.maxAge).toBe(1);
            expect(cookie.path).toBe('/');
            expect(cookie.domain).toBe('localhost');
            expect(cookie.secure).toBe(true);
            expect(cookie.httpOnly).toBe(true);
            expect(cookie.sameSite).toBe('None');
        });
    });

    describe('toString', function () {
        it('should set all entries', function () {
            const name = 'name';
            const value = 'value';
            const expires = new Date();
            const maxAge = 1;
            const path = '/';
            const domain = 'localhost';
            const secure = true;
            const httpOnly = true;
            const sameSite = SameSite.None;
            const cookie = new Cookie(name, value, {
                expires,
                maxAge,
                path,
                domain,
                secure,
                httpOnly,
                sameSite
            });
            const result = cookie.toString();
            const expected = `${name}=${value
                }; Expires=${expires.toUTCString()
                }; Max-Age=${maxAge
                }; Path=${path
                }; Domain=${domain
                }; Secure; HttpOnly; SameSite=${sameSite}`;
            expect(result).toBe(expected);
        });
    });
});
