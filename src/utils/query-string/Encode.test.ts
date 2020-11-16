import { encode } from "./Encode";

describe('encode', function () {
    it('should not create a query string for undefined', function () {
        const result = encode({
            key: undefined
        });
        expect(result).toBe('');
    });

    it('should create a query string for true', function () {
        const result = encode({
            key: true
        });
        expect(result).toBe('key=true');
    });

    it('should create a query string for number', function () {
        const result = encode({
            key: 1
        });
        expect(result).toBe('key=1');
    });

    it('should create a query string for string', function () {
        const result = encode({
            key: 'value'
        });
        expect(result).toBe('key=value');
    });

    it('should create an encoded query string for strings', function () {
        const input = {
            a: 'first last'
        };
        const output = encode(input);
        expect(output).toBe('a=first%20last');
    });

    it('should create a query string for null', function () {
        const result = encode({
            key: null
        });
        expect(result).toBe('key=null');
    });

    it('should create a query string for multiple primitives', function () {
        const result = encode({
            a: 'valueA',
            b: 'valueB'
        });
        expect(result).toBe('a=valueA&b=valueB');
    });

    it('should create a query string for arrays', function () {
        const result = encode({
            key: [1, 2, 3]
        });
        expect(result).toBe('key[]=1&key[]=2&key[]=3');
    });

    it('should create an entry object for objects', function () {
        const result = encode({
            key: {
                a: 'valueA',
                b: 'valueB'
            }
        });
        expect(result).toBe('key[a]=valueA&key[b]=valueB');
    });

    it('should encode complex objects', function () {
        const result = encode({
            a: [
                1,
                2,
                {
                    c: 'valueC'
                }
            ],
            b: 'valueB'
        });
        expect(result).toBe('a[]=1&a[]=2&a[][c]=valueC&b=valueB');
    });
});
