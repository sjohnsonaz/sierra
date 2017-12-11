import Sierra, { Controller, middleware, route, Context, method, view, json, BodyMiddleware, SessionMiddleware } from '../scripts/Sierra';

import { request } from 'http';
import HandlebarsView from './HandlebarsView';

class TestController extends Controller {
    constructor() {
        super('/');
    }

    @route('get')
    @middleware(async (context) => {
        return { value: true };
    })
    async index(context: Context, value: any) {
        return value;
    }

    @method('post')
    async post($body: any) {
        return $body;
    }

    @method('get', '/:id')
    async get(id: string) {
        return { value: id };
    }

    @method('put', '/:id')
    async put(id: string, $body: any) {
        return {
            id: id,
            body: $body
        };
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

    @method('get', /\/regex/)
    async regex() {
        return 'regex';
    }
}

let port = 3001;
let testApplication = new Sierra();
HandlebarsView.viewRoot = './src/testApplications/views/';
testApplication.view(HandlebarsView.handle);

testApplication.use(BodyMiddleware.handle);
let sessionMiddleware = new SessionMiddleware(undefined);
testApplication.use(sessionMiddleware.handle);

testApplication.addController(new TestController());
testApplication.init();
testApplication.listen(port).then(() => {
    console.log('Listening to port: ' + port);
});