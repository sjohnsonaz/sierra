import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

import { getQueryString, urlStringToObject } from '../utils/EncodeUtil';

import { OutgoingMessage, OutputType } from './OutgoingMessage';
import { Session } from './Session';
import { CookieRegistry } from './Cookie';
import { Verb } from './Verb';

/**
 * The Context object for the RequestHandler Pipeline
 */
export class Context<T = any, U = any, V = any, X = any> {
    /** The IncomingMessage object */
    request: IncomingMessage;

    /** The ServerResponse object */
    response: ServerResponse;

    /** The Session object.  Holds session data */
    session?: Session<X>;

    /** The CookieRegistry object.  Holds Cookie data */
    cookies: CookieRegistry;

    /** Body data */
    body?: V;

    /** HTTP Verb */
    method: Verb;

    /** HTTP Content-Type header */
    contentType?: string;

    /** HTTP Accept Header */
    accept?: string[];

    /** URL */
    url: string;

    /** URL pathname */
    pathname: string;

    /** Query data */
    query: T;

    /** URL Params data */
    params: U;

    /** View template */
    template: string;

    /** HTTP Content-Type charset */
    charset?: string;

    /** HTTP Content-Type boundary */
    httpBoundary?: string;

    /**
     * The Context constructor
     * @param request - an incoming request
     * @param response - an outgoing response
     */
    constructor(request: IncomingMessage, response: ServerResponse) {
        this.request = request;
        this.response = response;
        this.method = request.method.toLowerCase() as any;
        this.cookies = new CookieRegistry(request);

        // Content Type
        const contentType = getContentType(request);
        this.contentType = contentType.mediaType;
        this.charset = contentType.charset;
        this.httpBoundary = contentType.boundary;

        // Accept Type
        this.accept = getAccept(request);

        this.url = request.url;

        let url = new URL(request.url, 'http://' + request.headers.host + '/');
        // Remove ending '/' from pathname, unless only single '/'.
        let pathname = url.pathname;
        if (pathname !== '/' && pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        this.pathname = pathname;
        this.query = urlStringToObject(getQueryString(request.url)) as any;
    }

    /**
     * Creates an OutgoingMessage object.
     * @param data - the data to send
     * @param status - the status code
     * @param type - the type of output
     * @param template - the template name if sending a View
     * @param contentType - the Content-Type header
     */
    send<U>(data: U, status?: number, type?: OutputType, template?: string, contentType?: string) {
        return new OutgoingMessage(data, status, type, template, contentType);
    }
}

export function getContentType(request: IncomingMessage) {
    const contentTypeHeader = request.headers['content-type'];
    const contentType: {
        mediaType?: string;
        charset?: string;
        boundary?: string;
    } = {};
    if (contentTypeHeader) {
        let parts = contentTypeHeader.split('; ');
        contentType.mediaType = parts[0].trim().toLowerCase();
        if (parts.length > 1) {
            const hash: Record<string, any> = {};
            for (let index = 1, length = parts.length; index < length; index++) {
                const part = parts[index];
                const hashParts = part.split('=');
                if (hashParts.length > 1) {
                    hash[hashParts[0].trim()] = hashParts[1].trim();
                }
            }
            contentType.charset = hash['charset'];
            contentType.boundary = hash['boundary'];
        }
    }
    return contentType;
}

export function getAccept(request: IncomingMessage) {
    const accept = request.headers['accept'];
    if (accept) {
        let types = accept.split(',');
        return types.map(type => {
            let parts = type.split(';');
            return parts[0];
        });
    } else {
        return [];
    }
}