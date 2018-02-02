//import * from 'http';

import Context from '../server/Context';
import EncodeUtil from '../utils/EncodeUtil';
import { request } from 'https';

export default class BodyMiddleware {
    static handle(context: Context) {
        let verb = context.request.method.toLowerCase();
        if (verb === 'post' || verb === 'put') {
            let body = [];
            return new Promise<any>((resolve, reject) => {
                try {
                    context.request.on('error', (e) => {
                        reject(e);
                    }).on('data', (data) => {
                        body.push(data);
                    }).on('end', () => {
                        try {
                            let result: any;
                            let bufferedData: string;
                            let buffer = Buffer.concat(body);
                            switch (context.contentType) {
                                case 'multipart/form-data':
                                    result = BodyMiddleware.decodeMultiPartForm(context, buffer);
                                    break;
                                case 'application/x-www-form-urlencoded':
                                    bufferedData = buffer.toString().trim();
                                    result = bufferedData ? EncodeUtil.urlStringToObject(bufferedData) : null;
                                    break;
                                case 'application/json':
                                    bufferedData = buffer.toString().trim();
                                    result = bufferedData ? JSON.parse(bufferedData) : null;
                                case 'text/plain':
                                default:
                                    bufferedData = buffer.toString().trim();
                                    result = bufferedData;
                                    break;
                            }
                            context.body = result;
                            resolve(result);
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

    static decodeMultiPartForm(context: Context, buffer: Buffer) {
        let result: Object = {};

        let fields: Field[] = [];
        let boundary = '--' + context.httpBoundary;
        let boundaryEnd = boundary + '--';
        let boundaryLength = boundary.length;

        let length = buffer.length;
        let index = buffer.indexOf(boundary, 0, 'ascii') + boundaryLength;
        while (index < length) {
            let nextIndex = buffer.indexOf(boundary, index, 'ascii');
            if (nextIndex === -1) {
                break;
            }
            let bufferPart = buffer.slice(index, nextIndex - 1);

            let field: Field = BodyMiddleware.createField(bufferPart);
            fields.push(field);

            index = nextIndex + boundaryLength;
        }

        fields.forEach(field => {
            if (field.name) {
                if (field.filename) {
                    result[field.name] = {
                        filename: field.filename,
                        data: field.data,
                        type: field.type
                    };
                } else {
                    result[field.name] = field.data;
                }
            }
        });

        return result;
    }

    static createField(buffer: Buffer) {
        let field: Field;
        let data = buffer.toString().trim();
        let lines = data.split('\r\n');

        let dispositionIndex = buffer.indexOf('Content-Disposition');
        let dispositionEnd = buffer.indexOf('\r\n', dispositionIndex);

        let typeIndex = buffer.indexOf('Content-Type');
        let typeEnd = buffer.indexOf('\r\n', typeIndex);

        let dispositionRow = buffer.slice(dispositionIndex, dispositionEnd).toString().trim();
        let typeRow = buffer.slice(typeIndex, typeEnd).toString().trim();

        //console.log('disposition:', dispositionIndex, dispositionEnd, dispositionRow);
        //console.log('type:', typeIndex, typeEnd, typeRow);

        field = new Field(dispositionRow);
        field.setContentType(typeRow);
        field.addData(buffer.slice(typeEnd + 4));

        return field;
    }
}

export class Field {
    header: string;
    name: string;
    filename: string;
    data: any;
    type: string;

    constructor(header: string) {
        this.header = header;

        let hash = Field.headerToHash(header);
        this.name = hash['name'];
        this.filename = hash['filename'];
        this.data = '';
    }

    addData(data: any) {
        this.data = data;
    }

    setContentType(header: string) {
        let nameParts = header.split(': ');
        if (nameParts) {
            this.type = nameParts[1];
        }
    }

    static headerToHash(header: string) {
        let hash = {};
        let parts = header.split('; ');

        // Header Name
        if (parts && parts[0]) {
            let nameParts = parts[0].split(': ');
            if (nameParts && nameParts.length === 2) {
                hash[nameParts[0]] = nameParts[1];
            }
            parts.shift();
        }

        // Header Data
        parts.forEach(part => {
            let match = part.trim().match(/(.*)=\"(.*)\"/);
            if (match && match.length === 3) {
                hash[match[1]] = match[2];
            }
        });
        return hash;
    }
}