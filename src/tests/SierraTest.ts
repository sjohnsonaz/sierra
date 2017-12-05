import * as express from 'express';

import Sierra, { Controller, middleware, route, Context } from '../scripts/Sierra';

class TestController extends Controller {
    constructor() {
        super('/');
    }
    @route('get')
    @middleware(async (context: Context) => {
        return { value: true };
    })
    async get(context: Context, value: any) {
        return value;
    }
}

let port = 3001;
let testApplication = new Sierra();
testApplication.view(async function (context, data) {
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
});
testApplication.addController(new TestController());
testApplication.init();
testApplication.listen(port).then(() => {
    console.log('Listening to port: ' + port);
});