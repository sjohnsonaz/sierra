import { expect } from 'chai';

import * as http from 'http';
import * as fs from 'fs';

import Handlebars from 'handlebars';

import RequestHandler from '../scripts/server/RequestHandler';

let handler = new RequestHandler();

handler.use(async function (context, result) {
    //throw 'test error';
    return context.send({ value: 'test' });
});

handler.error = async function (context, error) {
    return error;
};

handler.view = async function (context, data) {
    var template = await new Promise((resolve, reject) => {
        fs.readFile('./view/index.handlebars', {
            encoding: 'utf8'
        }, (err, data: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    var compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(data);
}

let server = http.createServer(handler.callback);

let port = 3001;
server.listen(port, () => {
    console.log('Listening to port: ' + port);
});