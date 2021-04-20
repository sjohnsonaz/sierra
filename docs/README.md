# Sierra

![Node.js CI](https://github.com/sjohnsonaz/sierra/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/sierra.svg)](https://badge.fury.io/js/sierra)

**Middleware for your Node.js Server Application.**

Sierra provides Promise based Middleware and HTTP Request handling.


## Create a Handler

Sierra uses a Middleware pipeline to process HTTP Requests.  To get up and running, create a new `Handler` instance.

``` TypeScript
import { createHandler } from 'sierra';

const handler = new createHandler();
```


## Add Middleware

`Middleware` can be added to the `Handler`.

``` TypeScript
handler.use((context, value) => {
    return 'output';
});
```

`Handler.use` calls can be chained together.  This is especially useful for strong typing.

``` TypeScript
interface BodyContext {
    body: {
        value: string;
    }
}

interface SessionContext {
    session: {
        user: string;
    }
}

const handler = createHandler()
    .use<BodyContext>(({ data }) => {
        data.body = {
            value: 'test',
        };
    })
    .use<SessionContext>(({ data }) => {
        data.session = {
            user: 'admin',
        };
    })
    .use(({ data }) => {
        const { body, session } = data;
        const { value } = body;
        const { user } = session;
        return {
            value,
            user,
        };
    });
```


## Create a Server

A `Handler.callback` function may be passed to a Node.js `http.Server` instance.

``` TypeScript
import { createServer } from 'http';
import { createHandler } from 'sierra';

const handler = createHandler();

const server = createServer(handler.callback);

server.listen(80);
```

A special `Promise` based `PromiseServer` is also provided.

> When using `createServer` from Sierra, you may pass `Handler` instances directly.

``` TypeScript
import { createHandler, createServer } from 'sierra';

const handler = createHandler();

const server = createServer(handler);

server.start(80);
```
