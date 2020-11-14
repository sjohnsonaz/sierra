import { encode } from "./Encode";

describe('encode', function () {
    it('should create a query string for primitives', function () {
        const result = encode({
            key: 'value'
        });
        expect(result).toBe('key=value');
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
