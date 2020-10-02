import { objectToUrlString, urlStringToObject } from './EncodeUtil';

describe('EncodeUtil', function () {
    describe('objectToUrlString', function () {
        it('should handle number parameters', function () {
            const input = {
                a: 1234
            };
            const output = objectToUrlString(input);
            expect(output).toBe('a=1234');
        });

        it('should handle string parameters', function () {
            const input = {
                a: 'first last'
            };
            const output = objectToUrlString(input);
            expect(output).toBe('a=first%20last');
        });

        it('should handle array parameters', function () {
            const input = {
                a: ['first', 'last']
            };
            const output = objectToUrlString(input);
            expect(output).toBe('a[]=first&a[]=last');
        });
    });

    describe('urlStringToObject', function () {
        it('should handle string parameters', function () {
            const input = 'a=1234';
            const output = urlStringToObject(input);
            expect(output.a).toBe('1234');
        });

        it('should handle strings parameters with encoded characters', function () {
            const input = 'a=first%20last';
            const output = urlStringToObject(input);
            expect(output.a).toBe('first last');
        });

        it('should handle array parameters', function () {
            const input = 'a=first&a=last';
            const output = urlStringToObject(input);
            expect(output.a).toBeInstanceOf(Array);
            expect(output.a[0]).toBe('first');
            expect(output.a[1]).toBe('last');
        });

        it('should handle array bracket parameters', function () {
            const input = 'a[]=first&a[]=last';
            const output = urlStringToObject(input);
            expect(output.a).toBeInstanceOf(Array);
            expect(output.a[0]).toBe('first');
            expect(output.a[1]).toBe('last');
        });

        it('should handle array list parameters', function () {
            const input = 'a=first,last';
            const output = urlStringToObject(input);
            expect(output.a).toBeInstanceOf(Array);
            expect(output.a[0]).toBe('first');
            expect(output.a[1]).toBe('last');
        });

        it('should handle array mixed parameters', function () {
            const input = 'a=first&a[]=second&a=third,fourth';
            const output = urlStringToObject(input);
            expect(output.a).toBeInstanceOf(Array);
            expect(output.a.length).toBe(4);
            expect(output.a[0]).toBe('first');
            expect(output.a[1]).toBe('second');
            expect(output.a[2]).toBe('third');
            expect(output.a[3]).toBe('fourth');
        });
    });
});