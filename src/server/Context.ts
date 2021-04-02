import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

import { ContentType } from './ContentType';
import { CookieRegistry } from './cookie';
import { getVerb, Verb } from './Verb';

/**
 * The Context object for the RequestHandler Pipeline
 */
export class Context<DATA extends Object = {}> {
    /** The IncomingMessage object */
    request: IncomingMessage;
    /** The ServerResponse object */
    response: ServerResponse;

    /** HTTP Verb */
    method: Verb;
    /** URL */
    url: URL;
    /** HTTP Content-Type header */
    contentType: ContentType;
    /** HTTP Accept Header */
    accept: string[];

    data: DATA;

    /** The CookieRegistry object.  Holds Cookie data */
    cookies: CookieRegistry;

    /** View template */
    template?: string;

    /**
     * The Context constructor
     * @param request - an incoming request
     * @param response - an outgoing response
     */
    constructor(request: IncomingMessage, response: ServerResponse, initialData: DATA) {
        this.request = request;
        this.response = response;
        this.data = initialData;

        // Method
        this.method = getMethod(request);

        // Url
        this.url = getUrl(request);

        // Content Type
        this.contentType = getContentType(request);

        // Accept Type
        this.accept = getAccept(request);

        this.cookies = new CookieRegistry(request);
    }
}

export function getUrl(request: IncomingMessage) {
    return new URL(request.url || '', `http://${request.headers.host}`);
}

export function getMethod(request: IncomingMessage) {
    return getVerb(request.method);
}

export function getContentType(request: IncomingMessage) {
    const contentTypeHeader = request.headers['content-type'];
    const contentType: ContentType = {};
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
        return types.map((type) => {
            let parts = type.split(';');
            return parts[0];
        });
    } else {
        return [];
    }
}
