import { Controller, middleware, route, Context, method, json } from '../src/Sierra';

async function SimpleMiddleware() {
    return true;
}

export default class HomeController extends Controller {
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
    async get(id: number) {
        return { value: id };
    }

    @method('put', '/:id')
    async put(id: number, $body: any) {
        return {
            id: id,
            body: $body
        };
    }

    @method('get')
    async test(id: number) {
        return { id: id };
    }

    @method('get', 'testPipe/:id')
    async testPipe(id: number, name: string) {
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