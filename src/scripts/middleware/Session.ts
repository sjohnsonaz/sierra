import Context from '../server/Context';

export async function session(context: Context) {
    if (!context.request.headers.cookie) {
        context.response.setHeader('Set-Cookie', 'mycookie=test');
    }
}