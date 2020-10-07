import * as timers from 'timers';
import * as http from 'http';
import { Socket } from 'net';

export function wait(time: number) {
    return new Promise((resolve) => {
        timers.setTimeout(resolve, time);
    });
}

export function createRequest(requestInfo: Partial<http.IncomingMessage> = {}): [http.IncomingMessage, http.ServerResponse] {
    const socket = new Socket();
    const request = new http.IncomingMessage(socket);
    Object.entries(
        Object.assign({
            method: 'get'
        }, requestInfo))
        .forEach(([key, value]) => {
            (request as any)[key] = value;
        });
    const response = new http.ServerResponse(request);
    return [request, response];
}
