import { getArgumentNames, getParameterNames } from "./RouteUtil";

describe('RouteUtil', function () {
    describe('getParameterNames', function () {
        it('should get parameters from a function', function () {
            const method = eval(`

function method(a, b) {
}

method;`
            );

            const params = getParameterNames(method);
            expect(params.length).toBe(2);
            expect(params[0]).toBe('a');
            expect(params[1]).toBe('b');
        });

        it('should get parameters from an anonymous function', function () {
            const method = eval(`

const method = function (a, b) {
};

method;`
            );

            const params = getParameterNames(method);
            expect(params.length).toBe(2);
            expect(params[0]).toBe('a');
            expect(params[1]).toBe('b');
        });

        it('should get parameters from an arrow function', function () {
            const method = eval(`

const method = (a, b) => {
};

method;`
            );

            const params = getParameterNames(method);
            expect(params.length).toBe(2);
            expect(params[0]).toBe('a');
            expect(params[1]).toBe('b');
        });
    });

    describe('getArgumentNames', function () {
        it('should get parameters from a function', function () {
            const method = eval(`

function method(a, b) {
}

method;`
            );

            const params = getArgumentNames(method);
            expect(params.length).toBe(2);
            expect(params[0]).toBe('a');
            expect(params[1]).toBe('b');
        });

        it('should get parameters from an anonymous function', function () {
            const method = eval(`

const method = function (a, b) {
};

method;`
            );

            const params = getArgumentNames(method);
            expect(params.length).toBe(2);
            expect(params[0]).toBe('a');
            expect(params[1]).toBe('b');
        });

        it('should get parameters from an arrow function', function () {
            const method = eval(`

const method = (a, b) => {
};

method;`
            );

            const params = getArgumentNames(method);
            expect(params.length).toBe(2);
            expect(params[0]).toBe('a');
            expect(params[1]).toBe('b');
        });
    });

});