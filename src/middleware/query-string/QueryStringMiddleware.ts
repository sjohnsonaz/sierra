import { Context } from '../../server';
import { decode, getQueryString } from '../../utils/query-string';

export async function QueryStringMiddleware<QUERY>(context: Context<{ query: QUERY }>) {
    const queryString = getQueryString(context.request.url || '');
    const query = decode<QUERY>(queryString);
    context.data.query = query;
    return query;
}
