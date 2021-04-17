import { RouteGroup, Verb } from '../src';

async function SimpleMiddleware() {
    return true;
}

export function TestController() {
    const group = new RouteGroup();

    group.endpoint(
        Verb.Get,
        '',
        [
            SimpleMiddleware,
            async () => {
                return { value: true };
            },
        ],
        async (_context, value) => {
            return value;
        }
    );

    group.endpoint(Verb.Post, '', async (context) => {
        return {};
    });

    return group;
}
