import { ErrorMessage, NeverStartedError, NoMethodError, NoRouteFoundError, NoSessionGatewayError, NotFoundError, NoViewMiddlwareError, NoViewTemplateError } from './Errors';

describe('Errors', function () {
    describe('NeverStartedError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NeverStartedError();
            expect(error.message).toBe(ErrorMessage.neverStarted);
        });
    });

    describe('NoMethodError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoMethodError('method');
            expect(error.message).toBe(ErrorMessage.noMethod);
            expect(error.method).toBe('method');
        });
    });

    describe('NoRouteFoundError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoRouteFoundError();
            expect(error.message).toBe(ErrorMessage.noRouteFound);
        });
    });

    describe('NeverStartedError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NeverStartedError();
            expect(error.message).toBe(ErrorMessage.neverStarted);
        });
    });

    describe('NotFoundError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NotFoundError();
            expect(error.message).toBe(ErrorMessage.notFound);
        });
    });

    describe('NoSessionGatewayError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoSessionGatewayError();
            expect(error.message).toBe(ErrorMessage.noSessionGateway);
        });
    });

    describe('NoViewMiddlwareError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoViewMiddlwareError();
            expect(error.message).toBe(ErrorMessage.noViewMiddleware);
        });
    });

    describe('NoViewTemplateError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoViewTemplateError('template');
            expect(error.message).toBe(ErrorMessage.noViewTemplate);
            expect(error.template).toBe('template');
        });
    });
});
