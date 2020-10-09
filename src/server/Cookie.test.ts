import { createRequest } from '../utils/TestUtil';
import { CookieRegistry, Cookie, SameSite } from './Cookie';

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

describe('CookieRegistry', function () {
    describe('constructor', function () {
        it('should initialize Cookie hashes', function () {
            const [request] = createRequest();
            const cookie = new Cookie('name', 'value');
            request.headers['cookie'] = cookie.toString();
            const cookieRegistry = new CookieRegistry(request);
            expect(Object.keys(cookieRegistry.incoming).length).toBe(1);
            expect(Object.keys(cookieRegistry.outgoing).length).toBe(1);
            expect(cookieRegistry.incoming['name']).toBeInstanceOf(Cookie);
            expect(cookieRegistry.outgoing['name']).toBeInstanceOf(Cookie);
        });
    });

    describe('addCookie', function () {
        it('should accept a Cookie', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const cookie = new Cookie('name', 'value');
            cookieRegistry.addCookie(cookie);

            expect(cookieRegistry.outgoing['name']).toBe(cookie);
        });

        it('should create a new Cookie', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const cookie = cookieRegistry.addCookie('name', 'value');

            expect(cookieRegistry.outgoing['name']).toBe(cookie);
        });
    });

    describe('removeCookie', function () {
        it('should get a Cookie', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            cookieRegistry.addCookie('name', 'value');
            cookieRegistry.removeCookie('name')

            expect(cookieRegistry.outgoing['name']).toBeUndefined();
        });
    });

    describe('getCookie', function () {
        it('should get a Cookie', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const cookie = new Cookie('name', 'value');
            cookieRegistry.addCookie(cookie);
            const result = cookieRegistry.getCookie('name');

            expect(result).toBe(cookie);
        });

        it('should get undefined if no Cookie exists', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const result = cookieRegistry.getCookie('name');

            expect(result).toBeUndefined();
        });
    });

    describe('getOrCreateCookie', function () {
        it('should get a Cookie', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const cookie = new Cookie('name', 'value');
            cookieRegistry.addCookie(cookie);
            const result = cookieRegistry.getOrCreateCookie('name');

            expect(result).toBe(cookie);
        });

        it('should create a Cookie', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const result = cookieRegistry.getOrCreateCookie('name');

            expect(result).toBeInstanceOf(Cookie);
        });
    });

    describe('getCookies', function () {
        it('should get all Cookies', function () {
            const [request] = createRequest();
            const cookieRegistry = new CookieRegistry(request);
            cookieRegistry.addCookie('a', 'valueA');
            cookieRegistry.addCookie('b', 'valueB');
            const result = cookieRegistry.getCookies();

            expect(result.length).toBe(2);
            expect(result[0].name).toBe('a');
            expect(result[1].name).toBe('b');
        });
    });

    describe('setCookies', function () {
        it('should not set unchanged Cookies', function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('name', 'value');
            request.headers['cookie'] = cookie.toString();
            const cookieRegistry = new CookieRegistry(request);

            const nameCookie = cookieRegistry.getCookie('name');
            nameCookie.value = 'value';
            cookieRegistry.setCookies(response);

            const setCookie = response.getHeader('set-cookie') as string[];
            expect(setCookie.length).toBe(0);
        });

        it('should update changed Cookies', function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('name', 'value');
            request.headers['cookie'] = cookie.toString();
            const cookieRegistry = new CookieRegistry(request);

            const nameCookie = cookieRegistry.getCookie('name');
            nameCookie.value = 'new value';
            cookieRegistry.setCookies(response);

            const setCookie = response.getHeader('set-cookie') as string[];
            expect(setCookie.length).toBe(1);
            expect(setCookie[0]).toBe(nameCookie.toString());
        });

        it('should create Cookies', function () {
            const [request, response] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            const nameCookie = cookieRegistry.addCookie('name', 'value');
            cookieRegistry.setCookies(response);

            const setCookie = response.getHeader('set-cookie') as string[];
            expect(setCookie.length).toBe(1);
            expect(setCookie[0]).toBe(nameCookie.toString());
        });

        it('should do nothing if a Cookie is removed', function () {
            const [request, response] = createRequest();
            const cookie = new Cookie('name', 'value');
            request.headers['cookie'] = cookie.toString();
            const cookieRegistry = new CookieRegistry(request);

            cookieRegistry.removeCookie('name')
            cookieRegistry.setCookies(response);

            const setCookie = response.getHeader('set-cookie') as string[];
            expect(setCookie.length).toBe(0);
        });

        it('should do nothing if no Cookies are present', function () {
            const [request, response] = createRequest();
            const cookieRegistry = new CookieRegistry(request);

            cookieRegistry.setCookies(response);

            const setCookie = response.getHeader('set-cookie') as string[];
            expect(setCookie.length).toBe(0);
        });
    });

    describe('stringToHash', function () {
        it('should create a key for each entry', function () {
            const result = CookieRegistry.stringToHash('a=1; b=2');
            const keys = Object.keys(result);
            expect(keys.length).toBe(2);
            expect(keys[0]).toBe('a');
            expect(result[keys[0]]).toBe('1');
            expect(keys[1]).toBe('b');
            expect(result[keys[1]]).toBe('2');
        });

        it('should ignore keys with multiple "="', function () {
            const result = CookieRegistry.stringToHash('a=1=3; b=2');
            const keys = Object.keys(result);
            expect(keys.length).toBe(1);
            expect(keys[0]).toBe('b');
            expect(result[keys[0]]).toBe('2');
        });

        it('should ignore keys with undefined name', function () {
            const result = CookieRegistry.stringToHash('=1; b=2');
            const keys = Object.keys(result);
            expect(keys.length).toBe(1);
            expect(keys[0]).toBe('b');
            expect(result[keys[0]]).toBe('2');
        });

        it('should ignore keys with undefined value', function () {
            const result = CookieRegistry.stringToHash('a=; b=2');
            const keys = Object.keys(result);
            expect(keys.length).toBe(1);
            expect(keys[0]).toBe('b');
            expect(result[keys[0]]).toBe('2');
        });

        it('should ignore keys without ";" delimeter', function () {
            const result = CookieRegistry.stringToHash('a=1 b=2');
            const keys = Object.keys(result);
            expect(keys.length).toBe(0);
        });
    });
});
