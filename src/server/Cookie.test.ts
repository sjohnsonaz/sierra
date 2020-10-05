import { Cookie } from "../Sierra";

describe('Cookie', function () {
    describe('constructor', function () {
        it('should create a _data hash', function () {
            const cookie = new Cookie('');
            expect(cookie._data).toBeInstanceOf(Object);
        });
    });

    describe('getters and setters', function () {
        const Expires = 'Expires';
        const Domain = 'Domain';
        const Path = 'Path';
        it('should set id', function () {
            const cookie = new Cookie('');
            cookie.id = '1';
            expect(cookie._data[Cookie.identifier]).toBe('1');
        });

        it('should get id', function () {
            const cookie = new Cookie('');
            cookie.id = '1';
            expect(cookie.id).toBe('1');
        });

        it('should set Expires', function () {
            const cookie = new Cookie('');
            cookie.expires = 'Expires';
            expect(cookie._data[Expires]).toBe('Expires');
        });

        it('should get Expires', function () {
            const cookie = new Cookie('');
            cookie.expires = 'Expires';
            expect(cookie.expires).toBe('Expires');
        });

        it('should set Domain', function () {
            const cookie = new Cookie('');
            cookie.domain = 'Domain';
            expect(cookie._data[Domain]).toBe('Domain');
        });

        it('should get Domain', function () {
            const cookie = new Cookie('');
            cookie.domain = 'Domain';
            expect(cookie.domain).toBe('Domain');
        });

        it('should set Path', function () {
            const cookie = new Cookie('');
            cookie.path = 'Path';
            expect(cookie._data[Path]).toBe('Path');
        });

        it('should get Path', function () {
            const cookie = new Cookie('');
            cookie.path = 'Path';
            expect(cookie.path).toBe('Path');
        });
    });

    describe('stringToHash', function () {
        it('should create a key for each entry', function () {
            const result = Cookie.stringToHash('a=1; b=2');
            expect(Object.keys(result).length).toBe(2);
            expect(result['a']).toBe('1');
            expect(result['b']).toBe('2');
        });
    });

    describe('hashToCookie', function () {
        it('should create an entry for each key', function () {
            const result = Cookie.hashToCookie({
                a: '1',
                b: '2'
            });
            expect(result).toBe('a=1; b=2;');
        });
    });
});