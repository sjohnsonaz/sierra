import { Uuid } from './Uuid';

describe('Uuid', function () {
    describe('create', function () {
        it('should create a Uuid string', function () {
            const uuid = Uuid.create();
            expect(uuid.length).toBe(36);
            const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
            expect(regex.test(uuid)).toBe(true);
        });
    });
});