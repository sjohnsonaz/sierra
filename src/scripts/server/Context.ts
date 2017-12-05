import * as http from 'http';

import OutgoingMessage from './OutgoingMessage';

export default class Context {
    request: http.IncomingMessage;
    response: http.ServerResponse;

    constructor(request: http.IncomingMessage, response: http.ServerResponse) {
        this.request = request;
        this.response = response;
    }

    send<T>(data: T, status: number = 200) {
        return new OutgoingMessage(data, status);
    }
}