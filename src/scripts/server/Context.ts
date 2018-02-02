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
    contentType: string;
    accept: string[];
    url: string;
    pathname: string;
    query: any;
    params: any;
    template: string;

    constructor(request: http.IncomingMessage, response: http.ServerResponse) {
        this.request = request;
        this.response = response;
        this.method = request.method.toLowerCase() as any;

        // Content Type
        let contentTypeHeader = (this.request.headers['content-type'] || '').toLowerCase();
        let contentType = contentTypeHeader;
        if (contentType) {
            contentType = contentTypeHeader.split(';')[0];
        }
        this.contentType = contentType;

        // Accept Type
        // TODO: Adjust for priority
        let accept: string = request.headers['accept'];
        if (accept) {
            let types = accept.split(',');
            this.accept = types.map(type => {
                let parts = type.split(';');
                return parts[0];
            });
        } else {
            this.accept = [];
        }

        this.url = request.url;
        let url = Url.parse(request.url, true);
        // Remove ending '/' from pathname
        let pathname = url.pathname;
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        this.pathname = pathname;
        this.query = url.query;
    }

    send<U>(data: U, status: number = 200) {
        return new OutgoingMessage(data, status);
    }
}