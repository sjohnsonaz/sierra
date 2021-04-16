import { Context } from '../../server';
import { decode } from '../../utils/query-string';

import { BufferDecoder } from './BufferDecoder';

export async function BodyMiddleware<BODY, CONTEXT extends Context<{ body: BODY }>>(
    context: CONTEXT
) {
    let verb = context.request.method?.toLowerCase();
    if (verb === 'post' || verb === 'put') {
        switch (context.contentType.mediaType) {
            case 'multipart/form-data':
                return await handleFormData(context);
            case 'application/x-www-form-urlencoded':
                return await handleUrlEncoded(context);
            case 'application/json':
                return await handleJson(context);
            case 'text/plain':
            default:
                return await handleText(context);
        }
    }
}

async function handleJson<BODY, CONTEXT extends Context<{ body: BODY }>>(context: CONTEXT) {
    let body: Buffer[] = [];
    return new Promise<any>((resolve, reject) => {
        try {
            context.request
                .on('error', (e) => {
                    reject(e);
                })
                .on('data', (data) => {
                    if (typeof data === 'string') {
                        body.push(Buffer.from(data));
                    } else {
                        body.push(data);
                    }
                })
                .on('end', () => {
                    try {
                        let bufferedData = Buffer.concat(body).toString().trim();
                        context.data.body = bufferedData ? JSON.parse(bufferedData) : null;
                        resolve(context.data.body);
                    } catch (e) {
                        reject(e);
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
}

async function handleUrlEncoded<BODY, CONTEXT extends Context<{ body: BODY }>>(context: CONTEXT) {
    let body: Buffer[] = [];
    return new Promise<any>((resolve, reject) => {
        try {
            context.request
                .on('error', (e) => {
                    reject(e);
                })
                .on('data', (data) => {
                    if (typeof data === 'string') {
                        body.push(Buffer.from(data));
                    } else {
                        body.push(data);
                    }
                })
                .on('end', () => {
                    try {
                        let bufferedData = Buffer.concat(body).toString().trim();
                        if (bufferedData) {
                            const data = decode(bufferedData);
                            context.data.body = data as any;
                        } else {
                            context.data.body = null as any;
                        }
                        resolve(context.data.body);
                    } catch (e) {
                        reject(e);
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
}

async function handleText<BODY, CONTEXT extends Context<{ body: BODY }>>(context: CONTEXT) {
    let body: Buffer[] = [];
    return new Promise<any>((resolve, reject) => {
        try {
            context.request
                .on('error', (e) => {
                    reject(e);
                })
                .on('data', (data) => {
                    if (typeof data === 'string') {
                        body.push(Buffer.from(data));
                    } else {
                        body.push(data);
                    }
                })
                .on('end', () => {
                    try {
                        let bufferedData = Buffer.concat(body).toString().trim();
                        context.data.body = bufferedData as any;
                        resolve(context.data.body);
                    } catch (e) {
                        reject(e);
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
}

async function handleFormData<BODY, CONTEXT extends Context<{ body: BODY }>>(context: CONTEXT) {
    const { boundary } = context.contentType;
    if (!boundary) {
        // TODO: Create error class
        throw 'No boundary';
    }
    let bufferDecoder = new BufferDecoder(boundary, () => {});
    return new Promise<any>((resolve, reject) => {
        try {
            context.request
                .on('error', (e) => {
                    reject(e);
                })
                .on('data', (data) => {
                    if (typeof data === 'string') {
                        bufferDecoder.addData(Buffer.from(data));
                    } else {
                        bufferDecoder.addData(data);
                    }
                })
                .on('end', () => {
                    try {
                        context.data.body = bufferDecoder.decode() as any;
                        resolve(context.data.body);
                    } catch (e) {
                        reject(e);
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
}
