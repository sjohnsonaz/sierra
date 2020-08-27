import chai = require('chai');
import { objectToUrlString, urlStringToObject } from './EncodeUtil';
const expect = chai.expect;

describe('EncodeUtil', function () {
    describe('objectToUrlString', function () {
        it('should handle number parameters', function () {
            const input = {
                a: 1234
            };
            const output = objectToUrlString(input);
            expect(output).to.equal('a=1234');
        });

        it('should handle string parameters', function () {
            const input = {
                a: 'first last'
            };
            const output = objectToUrlString(input);
            expect(output).to.equal('a=first%20last');
        });

        it('should handle array parameters', function () {
            const input = {
                a: ['first', 'last']
            };
            const output = objectToUrlString(input);
            expect(output).to.equal('a[]=first&a[]=last');
        });
    });

    describe('urlStringToObject', function () {
        it('should handle string parameters', function () {
            const input = 'a=1234';
            const output = urlStringToObject(input);
            expect(output.a).to.equal('1234');
        });

        it('should handle strings parameters with encoded characters', function () {
            const input = 'a=first%20last';
            const output = urlStringToObject(input);
            expect(output.a).to.equal('first last');
        });

        it('should handle array parameters', function () {
            const input = 'a=first&a=last';
            const output = urlStringToObject(input);
            expect(output.a).instanceOf(Array);
            expect(output.a[0]).to.equal('first');
            expect(output.a[1]).to.equal('last');
        });

        it('should handle array bracket parameters', function () {
            const input = 'a[]=first&a[]=last';
            const output = urlStringToObject(input);
            expect(output.a).instanceOf(Array);
            expect(output.a[0]).to.equal('first');
            expect(output.a[1]).to.equal('last');
        });

        it('should handle array list parameters', function () {
            const input = 'a=first,last';
            const output = urlStringToObject(input);
            expect(output.a).instanceOf(Array);
            expect(output.a[0]).to.equal('first');
            expect(output.a[1]).to.equal('last');
        });

        it('should handle array mixed parameters', function () {
            const input = 'a=first&a[]=second&a=third,fourth';
            const output = urlStringToObject(input);
            expect(output.a).instanceOf(Array);
            expect(output.a.length).to.equal(4);
            expect(output.a[0]).to.equal('first');
            expect(output.a[1]).to.equal('second');
            expect(output.a[2]).to.equal('third');
            expect(output.a[3]).to.equal('fourth');
        });
    });
});