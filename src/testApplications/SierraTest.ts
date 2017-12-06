import Sierra, { Controller, middleware, route, Context, BodyParser, Session, method, view, json } from '../scripts/Sierra';

import { request } from 'http';
import * as fs from 'fs';
import Handlebars from 'handlebars';

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

    @route('post')
    async post(context: Context, value: any) {
        return context.body;
    }

    @method('get')
    async test(id: string) {
        return { id: id };
    }

    @method('get', 'testPipe/:id')
    async testPipe(id: string, name: string) {
        return {
            id: id,
            name: name
        };
    }

    @route('get')
    async getJson(context: Context, value: any) {
        return json({ value: true });
    }
}

let port = 3001;
let testApplication = new Sierra();
testApplication.view(async function (context, data, template) {
    let templateFile = './src/testApplications/views/' + template + '.handlebars';
    var templateText = await new Promise((resolve, reject) => {
        fs.readFile(templateFile, {
            encoding: 'utf8'
        }, (err, data: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    var compiledTemplate = Handlebars.compile(templateText);
    return compiledTemplate(data);
});
testApplication.addMiddleware = function (requestHandler) {
    requestHandler.use(BodyParser.handle);
    requestHandler.use(Session.handle);
};
testApplication.addController(new TestController());
testApplication.init();
testApplication.listen(port).then(() => {
    console.log('Listening to port: ' + port);
});