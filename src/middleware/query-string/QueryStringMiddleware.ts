import { Context } from '../../server';
import { decode, getQueryString } from '../../utils/query-string';

export async function QueryStringMiddleware(context: Context) {
    const queryString = getQueryString(context.request.url || '');
    const query = decode(queryString);
    context.data.query = query;
    return query;
}
