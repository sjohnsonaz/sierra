import { IncomingMessage, ServerResponse } from 'http';

/**
 * The Context object for the Handler Pipeline
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export class Context<DATA extends Record<string, any> = {}> {
    /** The IncomingMessage object */
    request: IncomingMessage;
    /** The ServerResponse object */
    response: ServerResponse;

    data: DATA;

    /**
     * The Context constructor
     * @param request - an incoming request
     * @param response - an outgoing response
     */
    constructor(request: IncomingMessage, response: ServerResponse, initialData: DATA = {} as any) {
        this.request = request;
        this.response = response;
        this.data = initialData;
    }
}
