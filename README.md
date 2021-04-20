# Sierra

![Node.js CI](https://github.com/sjohnsonaz/sierra/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/sierra.svg)](https://badge.fury.io/js/sierra)

**Modern MVC support for your Node.js application.**

Sierra provides Promise based Middleware, Routing, and MVC style Controllers.

## Creating Application

Sierra uses a Middleware pipeline to process HTTP Requests.  To get up and running, create a new Sierra instance.

```` TypeScript
import Sierra from 'sierra';

let sierra = new Sierra();
````

Initialize Sierra builds all of the middleware and routes.

```` TypeScript
Sierra.prototype.init(): Handler;
````

Now Sierra is ready to listen.  Start it by calling.

```` TypeScript
Sierra.prototype.listen(port: number): Promise<http.Server>;
````

## Creating Controllers

Sierra uses a routing system to respond to HTTP Requests.  The `pathname` of the Request is matched against a series of `RegExp` objects.

We generate these routes through `Controller` objects.  When defining a Controller, extend `Controller`, and specify routes with either the `@method` or `@route` decorator.

```` TypeScript
import { Controller, method } from 'sierra';

export default class TestController extends Controller {

    @method('get')
    async index() {
        return {
            pageName: 'index'
        };
    }
}
````

Sierra will build routes automatically based on the Controller's `Controller.base` property.  This can be set manually, or through the constructor.

```` TypeScript
class Controller {
    base: string;
    constructor(base?:string);
}
````

If no `Controller.base` is set, it will be generated from name of the Controller.  If the Controller's name ends with `Controller`, `Service`, or `Router`, the portion preceeding that will be used.

## Creating Routes

We can define routes on a Controller by marking methods with `@method` or `@route` decorators.  Only methods marked with these decorators will be used as routes.

For example:

```` TypeScript
@method('get')
async get() {
}

@route('post')
async post(context: Context, value: any) {
}
````

These two decorators are very similar.  First off, we have an HTTP method, here called a `Verb`.  This is 

```` TypeScript
enum Verb {
    All = 'all',
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Delete = 'delete',
    Patch = 'patch',
    Options = 'options',
    Head = 'head'
}

function route<U extends IMiddleware<any, any>>(verb?: VerbType, name?: string | RegExp, pipeArgs: boolean = false);

function method<U extends Function>(verb?: VerbType, name?: string | RegExp);

function middleware<T extends IMiddleware<any, any>, U extends IMiddleware<any, any>>(middleware: T);
````

```` TypeScript
@method('post')
async post($body: Data) {
    return this.gateway.create($body);
}

@method('put', '/:id')
async put(id: string, $body: Data) {
    return this.gateway.update(id, $body);
}

@method('delete')
async delete(id: string) {
    return this.gateway.delete(id);
}
````

## Example Service

```` TypeScript
export default class DataController extends Controller {
    gateway: Gateway<Data>;

    constructor(gateway: Gateway<Data>) {
        super('data');
        this.gateway = gateway;
    }

    @method('get', '/')
    async list(page: number, pageSize: number) {
        return await this.gateway.find({
            page: page,
            pageSize: pageSize
        });
    }

    @method('get', '/:id')
    async get(id: string) {
        return await this.gateway.get(id);
    }

    @method('post')
    async post($body: Data) {
        return this.gateway.create($body);
    }

    @method('put', '/:id')
    async put(id: string, $body: Data) {
        return this.gateway.update(id, $body);
    }

    @method('delete')
    async delete(id: string) {
        return this.gateway.delete(id);
    }
}
````

## Add Controllers and Middleware

Before Sierra is initialized, call:

```` TypeScript
session.use(async (context: Context, value: any) => {
    return true;
});
````

```` TypeScript
session.addController(new ExampleController());
````
