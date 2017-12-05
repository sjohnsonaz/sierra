import { expect } from 'chai';

import * as http from 'http';
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
    return '\
        <!DOCTYPE html>\
        <html>\
        <head>\
        <title>Sierra</title>\
        </head>\
        <body>\
        <h1>Sierra</h1>\
        <p>\
        ' + JSON.stringify(data) + '\
        </p>\
        </body>\
        </html>\
    ';
}

let server = http.createServer(handler.create());

let port = 3001;
server.listen(port, () => {
    console.log('Listening to port: ' + port);
});