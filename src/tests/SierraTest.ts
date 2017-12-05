import * as express from 'express';

import { Controller, middleware, route, Context, Application } from '../scripts/Sierra';

class TestController extends Controller {
    constructor() {
        super('/');
    }
    @route('get')
    async get(context: Context) {
        return { value: true };
    }
}

let port = 3001;
let testApplication = new Application();
testApplication.requestHandler.view = async function (context, data) {
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
testApplication.requestHandler.error = async function (context, error) {
    throw error;
};
testApplication.addController(new TestController());
testApplication.init();
testApplication.listen(port).then(() => {
    console.log('Listening to port: ' + port);
});