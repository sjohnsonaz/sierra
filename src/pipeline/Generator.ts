const middlewares = [
    async (context: Context, next: Next) => {
        context.value.push(0);
        await next();
    },
    async (context: Context, next: Next) => {
        context.value.push(1);
        await next();
    },
];

interface Context {
    value: number[];
}

interface Next {
    (): Promise<any>;
}

export async function run() {
    const context: Context = { value: [] };
    for (let middleware of middlewares) {
        await middleware(context, async () => undefined);
    }
}

function* createIterator(context: Context) {
    for (let middleware of middlewares) {
        yield middleware(context, async () => undefined);
    }
}
