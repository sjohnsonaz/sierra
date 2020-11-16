import { getQueryString } from './EncodeUtil';

describe('getQueryString', function () {
    it('should return characters after "?"', function () {
        const url = 'http://localhost?test=1';
        const result = getQueryString(url);
        expect(result).toBe('test=1');
    });

    it('should return empty string if nocharacters are after "?"', function () {
        const url = 'http://localhost?';
        const result = getQueryString(url);
        expect(result).toBe('');
    });

    it('should return empty string if no "?" is present', function () {
        const url = 'http://localhost';
        const result = getQueryString(url);
        expect(result).toBe('');
    });
});
