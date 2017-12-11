import * as http from 'http';
import * as Url from 'url';

import OutgoingMessage from './OutgoingMessage';
import Session from './Session';
import { Verb } from '../router/Verb';

export default class Context {
    request: http.IncomingMessage;
    response: http.ServerResponse;
    session: Session<any>
    body: any;
    method: Verb;
    url: string;
    pathname: string;
    query: any;
    params: any;
    template: string;

    constructor(request: http.IncomingMessage, response: http.ServerResponse) {
        this.request = request;
        this.response = response;
        this.method = request.method.toLowerCase() as any;
        this.url = request.url;
        let url = Url.parse(request.url, true);
        this.pathname = url.pathname;
        this.query = url.query;
    }

    send<U>(data: U, status: number = 200) {
        return new OutgoingMessage(data, status);
    }
}