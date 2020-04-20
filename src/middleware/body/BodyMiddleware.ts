import Context from '../../server/Context';
import EncodeUtil from '../../utils/EncodeUtil';

import BufferDecoder from './BufferDecoder';

export default class BodyMiddleware {
    static async handle(context: Context) {
        let verb = context.request.method.toLowerCase();
        if (verb === 'post' || verb === 'put') {
            switch (context.contentType) {
                case 'multipart/form-data':
                    return await BodyMiddleware.handleFormData(context);
                case 'application/x-www-form-urlencoded':
                    return await BodyMiddleware.handleUrlEncoded(context);
                case 'application/json':
                    return await BodyMiddleware.handleJson(context);
                case 'text/plain':
                default:
                    return await BodyMiddleware.handleText(context);
            }
        }
    }

    static async handleJson(context: Context) {
        let body: Buffer[] = [];
        return new Promise<any>((resolve, reject) => {
            try {
                context.request.on('error', (e) => {
                    reject(e);
                }).on('data', (data) => {
                    if (typeof data === 'string') {
                        body.push(new Buffer(data));
                    } else {
                        body.push(data);
                    }
                }).on('end', () => {
                    try {
                        let bufferedData = Buffer.concat(body).toString().trim();
                        context.body = bufferedData ? JSON.parse(bufferedData) : null;
                        resolve(context.body);
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

    static async handleUrlEncoded(context: Context) {
        let body: Buffer[] = [];
        return new Promise<any>((resolve, reject) => {
            try {
                context.request.on('error', (e) => {
                    reject(e);
                }).on('data', (data) => {
                    if (typeof data === 'string') {
                        body.push(new Buffer(data));
                    } else {
                        body.push(data);
                    }
                }).on('end', () => {
                    try {
                        let bufferedData = Buffer.concat(body).toString().trim();
                        context.body = bufferedData ? EncodeUtil.urlStringToObject(bufferedData) : null;
                        resolve(context.body);
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

    static async handleText(context: Context) {
        let body: Buffer[] = [];
        return new Promise<any>((resolve, reject) => {
            try {
                context.request.on('error', (e) => {
                    reject(e);
                }).on('data', (data) => {
                    if (typeof data === 'string') {
                        body.push(new Buffer(data));
                    } else {
                        body.push(data);
                    }
                }).on('end', () => {
                    try {
                        let bufferedData = Buffer.concat(body).toString().trim();
                        context.body = bufferedData;
                        resolve(context.body);
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

    static async handleFormData(context: Context) {
        let bufferDecoder = new BufferDecoder(context.httpBoundary, () => { });
        return new Promise<any>((resolve, reject) => {
            try {
                context.request.on('error', (e) => {
                    reject(e);
                }).on('data', (data) => {
                    if (typeof data === 'string') {
                        bufferDecoder.addData(new Buffer(data));
                    } else {
                        bufferDecoder.addData(data);
                    }
                }).on('end', () => {
                    try {
                        context.body = bufferDecoder.decode();
                        resolve(context.body);
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
}