import { RouteGroup, Verb } from "../src";

async function SimpleMiddleware() {
    return true;
}

export function TestController() {
    const group = new RouteGroup();

    group.route(Verb.Get, '', [
        SimpleMiddleware,
        async () => {
            return { value: true };
        }
    ], async (_context, value) => {
        return value;
    });

    group.route(Verb.Post, '',
        async (context) => {
            return context.data.body;
        });

        
    return group;
}
