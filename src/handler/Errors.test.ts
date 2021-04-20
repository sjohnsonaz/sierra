import {
    ErrorMessage,
    NoMethodError,
    NonStringViewError,
    NoRouteFoundError,
    NoSessionGatewayError,
    NotFoundError,
    NoViewTemplateError,
} from './Errors';

describe('Errors', function () {
    describe('NoMethodError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoMethodError('method');
            expect(error.message).toBe(ErrorMessage.NoMethod);
            expect(error.method).toBe('method');
        });
    });

    describe('NoRouteFoundError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoRouteFoundError();
            expect(error.message).toBe(ErrorMessage.NoRouteFound);
        });
    });

    describe('NotFoundError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NotFoundError();
            expect(error.message).toBe(ErrorMessage.NotFound);
        });
    });

    describe('NoSessionGatewayError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoSessionGatewayError();
            expect(error.message).toBe(ErrorMessage.NoSessionGateway);
        });
    });

    describe('NoViewTemplateError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoViewTemplateError('template');
            expect(error.message).toBe(ErrorMessage.NoViewTemplate);
            expect(error.template).toBe('template');
        });
    });

    describe('NonStringViewError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NonStringViewError('output');
            expect(error.message).toBe(ErrorMessage.NonStringView);
            expect(error.output).toBe('output');
        });
    });
});
