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
                                    result = BodyMiddleware.decodeMultiPartForm(buffer);
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
    static decodeMultiPartForm(buffer: Buffer) {
        let data = buffer.toString().trim();

        let result: Object = {};

        let lines = data.split('\r\n');

        let fields: Field[] = [];
        let field: Field;
        for (let index = 0, length = lines.length; index < length; index++) {
            let row = lines[index];
            if (row.startsWith('Content-Disposition')) {
                field = new Field(row);
                fields.push(field);
            } else if (row && !row.startsWith('--')) {
                field.addData(row);
            }
        }

        fields.forEach(field => {
            if (field.name) {
                if (field.filename) {
                    result[field.name] = {
                        filename: field.filename,
                        data: field.data
                    };
                } else {
                    result[field.name] = field.data;
                }
            }
        });

        return result;
    }
}

export class Field {
    header: string;
    name: string;
    filename: string;
    data: any;

    constructor(header: string) {
        this.header = header;

        let hash = Field.headerToHash(header);
        this.name = hash['name'];
        this.filename = hash['filename'];
        this.data = '';
    }

    addData(data: any) {
        this.data += data;
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
/*

export class MultiPart {

    static handle(context: Context) {
        let verb = context.request.method.toLowerCase();
        if (verb === 'post' || verb === 'put') {
            var form = new multiparty.Form();
            var data = {};
            var files = {};
            var done;
            return new Promise<any>((resolve, reject) => {
                try {
                    function ondata(name, val, data) {
                        if (Array.isArray(data[name])) {
                            data[name].push(val);
                        } else if (data[name]) {
                            data[name] = [data[name], val];
                        } else {
                            data[name] = val;
                        }
                    }

                    context.request.on('field', function (name, val) {
                        ondata(name, val, data);
                    });

                    context.request.on('file', function (name, val) {
                        val.name = val.originalFilename;
                        val.type = val.headers['content-type'] || null;
                        ondata(name, val, files);
                    });

                    context.request.on('error', function (err) {
                        err.status = 400;
                        next(err);
                        done = true;
                    });

                    context.request.on('close', function () {
                        if (done) return;
                        try {
                            req.body = qs.parse(data);
                            req.files = qs.parse(files);
                        } catch (err) {
                            form.emit('error', err);
                            return;
                        }
                        next();
                    });

                    form.parse(req);
                }
                catch (e) {

                }
            }
        }
    }
    static create() {

        var limit = options.limit || '100mb';

        return function multipart(req, res, next) {
            if (req._body) return next();
            req.body = req.body || {};
            req.files = req.files || {};

            if (!utils.hasBody(req)) return next();

            // ignore GET
            if ('GET' == req.method || 'HEAD' == req.method) return next();

            // check Content-Type
            if ('multipart/form-data' != utils.mime(req)) return next();

            // flag as parsed
            req._body = true;

            // parse
            limit(req, res, function (err) {
                if (err) return next(err);

                var form = new multiparty.Form(options)
                    , data = {}
                    , files = {}
                    , done;

                Object.keys(options).forEach(function (key) {
                    form[key] = options[key];
                });

                function ondata(name, val, data) {
                    if (Array.isArray(data[name])) {
                        data[name].push(val);
                    } else if (data[name]) {
                        data[name] = [data[name], val];
                    } else {
                        data[name] = val;
                    }
                }

                form.on('field', function (name, val) {
                    ondata(name, val, data);
                });

                if (!options.defer) {
                    form.on('file', function (name, val) {
                        val.name = val.originalFilename;
                        val.type = val.headers['content-type'] || null;
                        ondata(name, val, files);
                    });
                }

                form.on('error', function (err) {
                    if (!options.defer) {
                        err.status = 400;
                        next(err);
                    }
                    done = true;
                });

                form.on('close', function () {
                    if (done) return;
                    try {
                        req.body = qs.parse(data);
                        req.files = qs.parse(files);
                    } catch (err) {
                        form.emit('error', err);
                        return;
                    }
                    if (!options.defer) next();
                });

                form.parse(req);

                if (options.defer) {
                    req.form = form;
                    next();
                }
            });
        }
    }
}  

*/