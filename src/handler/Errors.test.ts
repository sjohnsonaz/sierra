import {
    ErrorMessage,
    NonStringViewError,
    NotFoundError,
    NoViewMiddlewareError,
    NoViewTemplateError,
} from './Errors';

describe('Errors', function () {
    describe('NotFoundError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NotFoundError();
            expect(error.message).toBe(ErrorMessage.NotFound);
        });
    });

    describe('NoViewTemplateError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoViewTemplateError('template');
            expect(error.message).toBe(ErrorMessage.NoViewTemplate);
            expect(error.template).toBe('template');
        });
    });

    describe('NoViewMiddlewareError', function () {
        it('should use an ErrorMessage', function () {
            const error = new NoViewMiddlewareError();
            expect(error.message).toBe(ErrorMessage.NoViewMiddleware);
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
