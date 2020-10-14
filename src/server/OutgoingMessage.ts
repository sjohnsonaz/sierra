import { PipelineExit } from '../pipeline';

export type OutputType = 'auto' | 'json' | 'view' | 'text' | 'raw';

// TODO: Rename this to be different from http class
export class OutgoingMessage<T> extends PipelineExit {
    data: T;
    status: number;
    type: OutputType;
    template: string;
    contentType: string;

    constructor(data: T, status: number = 200, type: OutputType = 'auto', template?: string, contentType?: string) {
        super();
        this.data = data;
        this.status = status;
        this.type = type;
        this.template = template;
        this.contentType = contentType;
    }
}

export function send<T>(data: T, status: number = 200, type: OutputType = 'auto', template?: string, contentType?: string) {
    return new OutgoingMessage(data, status, type, template);
}

// TODO: Change to options parameter
export function view<T>(data: T, template?: string, status: number = 200) {
    return new OutgoingMessage(data, status, 'view', template);
}

export function json<T>(data: T, status: number = 200) {
    return new OutgoingMessage(data, status, 'json');
}

export function raw<T>(data: T, status: number = 200, contentType?: string) {
    return new OutgoingMessage(data, status, 'raw', undefined, contentType);
}