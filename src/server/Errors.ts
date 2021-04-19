export enum ErrorMessage {
    NeverStarted = 'Server has never been started',
    NoMethod = 'No method defined for this route',
    NoRouteFound = 'no route found',
    NotFound = 'not found',
    NoSessionGateway = 'no session gateway',
    NoViewMiddleware = 'No view middleware',
    NoViewTemplate = 'no view template',
    NonStringView = 'non string view',
}

export class SierraError extends Error {
    constructor(message: ErrorMessage) {
        super(message);
    }
}

export class NoMethodError extends SierraError {
    method: string;
    constructor(method: string) {
        super(ErrorMessage.NoMethod);
        this.method = method;
    }
}

export class NoRouteFoundError extends SierraError {
    constructor() {
        super(ErrorMessage.NoRouteFound);
    }
}

export class NotFoundError extends SierraError {
    constructor() {
        super(ErrorMessage.NotFound);
    }
}

export class NoSessionGatewayError extends SierraError {
    constructor() {
        super(ErrorMessage.NoSessionGateway);
    }
}

export class NoViewTemplateError extends SierraError {
    template: string;
    constructor(template: string) {
        super(ErrorMessage.NoViewTemplate);
        this.template = template;
    }
}

export class NonStringViewError extends SierraError {
    output: any;
    constructor(output: any) {
        super(ErrorMessage.NonStringView);
        this.output = output;
    }
}
