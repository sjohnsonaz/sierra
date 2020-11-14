import { createEntry, createEntries } from "./Encode";

describe('Encode', function () {
    describe('createEntry', function () {
        it('should create an entry object', function () {
            const result = createEntry('key', 'value');
            expect(result).toStrictEqual({
                key: 'key',
                value: 'value'
            });
        });
    });

    describe('createEntries', function () {
        it('should create an entry object for primitives', function () {
            const result = createEntries('key', 'value');
            expect(result).toStrictEqual([{
                key: 'key',
                value: 'value'
            }]);
        });

        it('should create a prefixed entry object for primitives', function () {
            const result = createEntries('key', 'value', undefined, 'prefix');
            expect(result).toStrictEqual([{
                key: 'prefix[key]',
                value: 'value'
            }]);
        });

        it('should create an entry object for arrays', function () {
            const result = createEntries('key', [1, 2, 3]);
            expect(result).toStrictEqual([{
                key: 'key[]',
                value: 1
            }, {
                key: 'key[]',
                value: 2
            }, {
                key: 'key[]',
                value: 3
            }]);
        });

        it('should create a prefixed entry object for arrays', function () {
            const result = createEntries('key', [1, 2, 3], undefined, 'prefix');
            expect(result).toStrictEqual([{
                key: 'prefix[key][]',
                value: 1
            }, {
                key: 'prefix[key][]',
                value: 2
            }, {
                key: 'prefix[key][]',
                value: 3
            }]);
        });

        it('should create an entry object for objects', function () {
            const result = createEntries('key', { a: 'valueA', b: 'valueB' });
            expect(result).toStrictEqual([{
                key: 'key[a]',
                value: 'valueA'
            }, {
                key: 'key[b]',
                value: 'valueB'
            }]);
        });

        it('should create a prefixed entry object for objects', function () {
            const result = createEntries('key', { a: 'valueA', b: 'valueB' }, undefined, 'prefix');
            expect(result).toStrictEqual([{
                key: 'prefix[key][a]',
                value: 'valueA'
            }, {
                key: 'prefix[key][b]',
                value: 'valueB'
            }]);
        });

        it('should create entry objects for complex objects', function () {
            const result = createEntries('key', {
                a: [
                    1,
                    2,
                    {
                        c: 'valueC'
                    }
                ],
                b: 'valueB'
            },
                undefined, 'prefix');
            expect(result).toStrictEqual([{
                key: 'prefix[key][a][]',
                value: 1
            }, {
                key: 'prefix[key][a][]',
                value: 2
            }, {
                key: 'prefix[key][a][][c]',
                value: 'valueC'
            }, {
                key: 'prefix[key][b]',
                value: 'valueB'
            }]);
        });
    });
});
