import { Context } from '../Context';
import { CookieRegistry } from './CookieRegistry';

export async function CookieMiddleware<T extends Context>(context: T) {
    type CookieContext = T & {
        cookieRegistry: CookieRegistry;
    };
    const cookieRegistry = new CookieRegistry(context.request);
    const cookieContext: CookieContext = context as any;
    cookieContext.cookieRegistry = cookieRegistry;
    return cookieRegistry;
}
