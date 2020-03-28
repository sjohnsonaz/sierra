import Sierra, { Controller, middleware, route, Context, method, json, BodyMiddleware, SessionMiddleware, ISessionGateway, Uuid } from '../scripts/Sierra';

import HandlebarsView from './HandlebarsView';

async function SimpleMiddleware() {
    return true;
}
class TestController extends Controller {
    constructor() {
        super('/');
    }

    @route('get')
    @middleware(SimpleMiddleware)
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
    @middleware(SimpleMiddleware)
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

class SessionGateway implements ISessionGateway<any> {
    async getId(context: Context): Promise<string> {
        return Uuid.create();
    }

    async load(context: Context, id: string): Promise<any> {
        return {
            id: id
        };
    }

    async save(context: Context, id: string, data: any): Promise<boolean> {
        return true;
    }

    async destroy(context: Context, id: string): Promise<boolean> {
        return true;
    }

    async regenerate(context: Context, id: string): Promise<any> {
        return {
            id: id
        };
    }

    async reload(context: Context, id: string): Promise<any> {
        return {
            id: id
        };
    }

    async touch(context: Context, id: string): Promise<boolean> {
        return true;
    }
}

let sessionMiddleware = new SessionMiddleware(new SessionGateway());
testApplication.use(sessionMiddleware.handle.bind(sessionMiddleware));

testApplication.addController(new TestController());
testApplication.init();
testApplication.listen(port).then(() => {
    console.log('Listening to port: ' + port);
});