import { Context } from '../../server';
import { decode } from '../../utils/query-string';

import { BufferDecoder } from './BufferDecoder';

export async function BodyMiddleware(context: Context) {
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

async function handleJson(context: Context) {
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
                    }
                    catch (e) {
                        reject(e);
                    }
                });
        }
        catch (e) {
            reject(e);
        }
    });
}

async function handleUrlEncoded(context: Context) {
    let body: Buffer[] = [];
    return new Promise<any>((resolve, reject) => {
        try {
            context.request.on('error', (e) => {
                reject(e);
            }).on('data', (data) => {
                if (typeof data === 'string') {
                    body.push(Buffer.from(data));
                } else {
                    body.push(data);
                }
            }).on('end', () => {
                try {
                    let bufferedData = Buffer.concat(body).toString().trim();
                    if (bufferedData) {
                        const data = decode(bufferedData);
                        context.data.body = data;
                    } else {
                        context.data.body = null;
                    }
                    resolve(context.data.body);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
}

async function handleText(context: Context) {
    let body: Buffer[] = [];
    return new Promise<any>((resolve, reject) => {
        try {
            context.request.on('error', (e) => {
                reject(e);
            }).on('data', (data) => {
                if (typeof data === 'string') {
                    body.push(Buffer.from(data));
                } else {
                    body.push(data);
                }
            }).on('end', () => {
                try {
                    let bufferedData = Buffer.concat(body).toString().trim();
                    context.data.body = bufferedData;
                    resolve(context.data.body);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
}

async function handleFormData(context: Context) {
    const { boundary } = context.contentType;
    if (!boundary) {
        // TODO: Create error class
        throw 'No boundary';
    }
    let bufferDecoder = new BufferDecoder(boundary, () => { });
    return new Promise<any>((resolve, reject) => {
        try {
            context.request.on('error', (e) => {
                reject(e);
            }).on('data', (data) => {
                if (typeof data === 'string') {
                    bufferDecoder.addData(Buffer.from(data));
                } else {
                    bufferDecoder.addData(data);
                }
            }).on('end', () => {
                try {
                    context.data.body = bufferDecoder.decode();
                    resolve(context.data.body);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
