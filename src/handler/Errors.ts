export enum ErrorMessage {
    NotFound = 'not found',
    NoViewMiddleware = 'No view middleware',
    NoViewTemplate = 'no view template',
    NonStringView = 'non string view',
}

export class SierraError extends Error {
    constructor(message: ErrorMessage) {
        super(message);
    }
}

export class NotFoundError extends SierraError {
    constructor() {
        super(ErrorMessage.NotFound);
    }
}

export class NoViewTemplateError extends SierraError {
    template: string;
    constructor(template: string) {
        super(ErrorMessage.NoViewTemplate);
        this.template = template;
    }
}

export class NoViewMiddlewareError extends SierraError {
    constructor() {
        super(ErrorMessage.NoViewMiddleware);
    }
}

export class NonStringViewError extends SierraError {
    output: any;
    constructor(output: any) {
        super(ErrorMessage.NonStringView);
        this.output = output;
    }
}
