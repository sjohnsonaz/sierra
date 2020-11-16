import { decode } from "./Decode";

describe('GraphDecode', function () {
    it('should decode a key value pair', function () {
        const result = decode('key=value');
        expect(result).toStrictEqual({
            key: 'value'
        });
    });
    it('should decode multiple key value pairs', function () {
        const result = decode('a=valueA&b=valueB');
        expect(result).toStrictEqual({
            a: 'valueA',
            b: 'valueB'
        });
    });

    it('should decode arrays', function () {
        const result = decode('array[]=1&array[]=2');
        expect(result).toStrictEqual({
            array: ['1', '2']
        });
    });

    it('should decode arrays', function () {
        const result = decode('filter[array][]=1&filter[array][]=2&filter[key]=value');
        expect(result).toStrictEqual({
            filter: {
                array: ['1', '2'],
                key: 'value'
            },
        });
    });

    it('should handle string parameters', function () {
        const input = 'a=1234';
        const output = decode(input);
        expect(output.a).toBe('1234');
    });

    it('should handle strings parameters with encoded characters', function () {
        const input = 'a=first%20last';
        const output = decode(input);
        expect(output.a).toBe('first last');
    });

    it('should handle array parameters', function () {
        const input = 'a=first&a=last';
        const output = decode(input);
        expect(output.a).toBeInstanceOf(Array);
        expect(output.a[0]).toBe('first');
        expect(output.a[1]).toBe('last');
    });

    it('should handle array bracket parameters', function () {
        const input = 'a[]=first&a[]=last';
        const output = decode(input);
        expect(output.a).toBeInstanceOf(Array);
        expect(output.a[0]).toBe('first');
        expect(output.a[1]).toBe('last');
    });

    it('should handle array list parameters', function () {
        const input = 'a=first,last';
        const output = decode(input);
        expect(output.a).toBeInstanceOf(Array);
        expect(output.a[0]).toBe('first');
        expect(output.a[1]).toBe('last');
    });

    it('should handle array mixed parameters', function () {
        const input = 'a=first&a[]=second&a=third,fourth';
        const output = decode(input);
        expect(output.a).toBeInstanceOf(Array);
        expect(output.a.length).toBe(4);
        expect(output.a).toContain('first');
        expect(output.a).toContain('second');
        expect(output.a).toContain('third');
        expect(output.a).toContain('fourth');
    });
});
