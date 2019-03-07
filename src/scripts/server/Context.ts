import * as http from 'http';
import { URL } from 'url';

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
    httpBoundary: string;

    constructor(request: http.IncomingMessage, response: http.ServerResponse) {
        this.request = request;
        this.response = response;
        this.method = request.method.toLowerCase() as any;

        // Content Type
        this.createContentType(request);

        // Accept Type
        this.createAccept(request);

        this.url = request.url;

        let url = new URL(request.url, 'http://' + request.headers.host + '/');
        // Remove ending '/' from pathname, unless only single '/'.
        let pathname = url.pathname;
        if (pathname !== '/' && pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        this.pathname = pathname;
        this.query = url.searchParams;
    }

    private createContentType(request: http.IncomingMessage) {
        let contentTypeHeader = (this.request.headers['content-type'] || '').toLowerCase();
        let contentType = contentTypeHeader;
        if (contentType) {
            let parts = contentTypeHeader.split('; ');
            contentType = parts[0];
            if (parts.length > 1) {
                let hash = {};
                parts.shift();
                parts.forEach(part => {
                    let hashParts = part.split('=');
                    if (hashParts.length > 1) {
                        hash[hashParts[0]] = hashParts[1];
                    }
                });
                this.httpBoundary = hash['boundary'];
            }
        }
        this.contentType = contentType;
    }

    // TODO: Adjust for priority
    private createAccept(request: http.IncomingMessage) {
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
    }

    send<U>(data: U, status: number = 200) {
        return new OutgoingMessage(data, status);
    }
}