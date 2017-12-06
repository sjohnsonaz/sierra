export default class OutgoingMessage<T>{
    data: T;
    status: number;
    template: string;
    json: boolean;

    constructor(data: any, status: number = 200, template?: string, json?: boolean) {
        this.data = data;
        this.status = status;
        this.template = template;
        this.json = json;
    }
}

export function view<T>(data: T, template?: string) {
    return new OutgoingMessage(data, 200, template, false);
}

export function json<T>(data: T, status: number = 200) {
    return new OutgoingMessage(data, status, undefined, true);
}