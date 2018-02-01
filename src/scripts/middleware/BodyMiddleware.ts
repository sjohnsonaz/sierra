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
                            let bufferedData = Buffer.concat(body).toString().trim();
                            let result: any;
                            switch (context.contentType) {
                                case 'application/json':
                                    result = bufferedData ? JSON.parse(bufferedData) : null;
                                case 'multipart/form-data':
                                    result = BodyMiddleware.decodeMultiPartForm(bufferedData);
                                    break;
                                case 'application/x-www-form-urlencoded':
                                    result = bufferedData ? EncodeUtil.urlStringToObject(bufferedData) : null;
                                    break;
                                case 'text/plain':
                                default:
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
    static decodeMultiPartForm(data: string) {
        let result: Object = {};

        let lines = data.split('\r\n');
        for (let index = 0, length = lines.length / 4; index < length; index++) {
            let nameRow = lines[index * 4 + 1];
            let valueRow = lines[index * 4 + 3];
            if (nameRow && valueRow) {
                let match = nameRow.match(/.*name=\"(.*)\"/);
                if (match && match[1]) {
                    let name = match[1];
                    result[name] = valueRow;
                }
            }
        }
        return result;
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