import chai = require('chai');
import EncodeUtil from './EncodeUtil';
let expect = chai.expect;

describe('EncodeUtil', function () {
    describe('objectToUrlString', function () {
        it('should handle number parameters', function () {
            let input = {
                a: 1234
            };
            let output = EncodeUtil.objectToUrlString(input);
            expect(output).to.equal('a=1234');
        });

        it('should handle string parameters', function () {
            let input = {
                a: 'first last'
            };
            let output = EncodeUtil.objectToUrlString(input);
            expect(output).to.equal('a=first%20last');
        });

        it('should handle array parameters', function () {
            let input = {
                a: ['first', 'last']
            };
            let output = EncodeUtil.objectToUrlString(input);
            expect(output).to.equal('a[]=first&a[]=last');
        });
    });

    describe('urlStringToObject', function () {
        it('should handle string parameters', function () {
            let input = 'a=1234';
            let output = EncodeUtil.urlStringToObject(input);
            expect(output.a).to.equal('1234');
        });

        it('should handle strings parameters with encoded characters', function () {
            let input = 'a=first%20last';
            let output = EncodeUtil.urlStringToObject(input);
            expect(output.a).to.equal('first last');
        });

        it('should handle array parameters', function () {
            let input = 'a[]=first&a[]=last';
            let output = EncodeUtil.urlStringToObject(input);
            expect(output.a).instanceOf(Array);
            expect(output.a[0]).to.equal('first');
            expect(output.a[1]).to.equal('last');
        });
    });
});