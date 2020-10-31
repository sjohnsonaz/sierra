export enum ErrorMessage {
    neverStarted = 'Server has never been started',
    noMethod = 'No method defined for this route',
    noRouteFound = 'no route found',
    notFound = 'not found',
    noSessionGateway = 'no session gateway',
    noViewMiddleware = 'No view middleware',
    noViewTemplate = 'no view template'
}

export class SierraError extends Error {
    constructor(message: ErrorMessage) {
        super(message);
    }
}

export class NoMethodError extends SierraError {
    method: string;
    constructor(method: string) {
        super(ErrorMessage.noMethod);
        this.method = method;
    }
}

export class NoRouteFoundError extends SierraError {
    constructor() {
        super(ErrorMessage.noRouteFound);
    }
}

export class NotFoundError extends SierraError {
    constructor() {
        super(ErrorMessage.notFound);
    }
}

export class NoSessionGatewayError extends SierraError {
    constructor() {
        super(ErrorMessage.noSessionGateway);
    }
}

export class NoViewMiddlwareError extends SierraError {
    constructor() {
        super(ErrorMessage.noViewMiddleware);
    }
}

export class NoViewTemplateError extends SierraError {
    template: string;
    constructor(template: string) {
        super(ErrorMessage.noViewTemplate);
        this.template = template;
    }
}
