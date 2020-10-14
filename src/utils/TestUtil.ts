import * as timers from 'timers';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

export function wait(time: number) {
    return new Promise<void>((resolve) => {
        timers.setTimeout(resolve, time);
    });
}

export function createRequest(requestInfo: Partial<IncomingMessage> = {}): [IncomingMessage, ServerResponse] {
    const socket = new Socket();
    const request = new IncomingMessage(socket);
    Object.entries(
        Object.assign({
            method: 'get'
        }, requestInfo))
        .forEach(([key, value]) => {
            (request as any)[key] = value;
        });
    const response = new ServerResponse(request);
    return [request, response];
}
