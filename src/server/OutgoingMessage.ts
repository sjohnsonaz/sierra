import { PipelineExit } from "../pipeline/Pipeline";

export type OutputType = 'auto' | 'json' | 'view' | 'text' | 'raw';

export default class OutgoingMessage<T> extends PipelineExit {
    data: T;
    status: number;
    type: OutputType;
    template: string;
    contentType: string;

    constructor(data: any, status: number = 200, type: OutputType = 'auto', template?: string, contentType?: string) {
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

export function view<T>(data: T, template?: string) {
    return new OutgoingMessage(data, 200, 'view', template);
}

export function json<T>(data: T, status: number = 200) {
    return new OutgoingMessage(data, status, 'json');
}

export function raw<T>(data: T, status: number = 200, contentType?: string) {
    return new OutgoingMessage(data, status, 'raw', undefined, contentType);
}