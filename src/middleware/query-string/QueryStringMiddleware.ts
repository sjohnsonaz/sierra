import { Context } from '../../server';
import { decode, DecodedQuery, getQueryString } from '../../utils/query-string';

export async function QueryStringMiddleware<T extends Context>(context: T) {
    type QueryContext = T & {
        query: DecodedQuery;
    };
    const queryString = getQueryString(context.request.url || '');
    const query = decode(queryString);
    const queryContext: QueryContext = context as any;
    queryContext.query = query;
    return query;
}
