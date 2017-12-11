
import Context from '../server/Context';
import Session from '../server/Session';
import { ISessionGateway } from '../server/ISessionGateway';

import Uuid from '../utils/Uuid';

export default class SessionMiddleware<T> {
    static gateway: ISessionGateway<any>;

    static async handle(context: Context) {
        let cookie = context.request.headers.cookie;
        let cookies = Session.cookieToHash(cookie);
        if (!cookies['sierra_id']) {
            let id = await this.gateway.getId(context);
            cookies['sierra_id'] = id;
            context.response.setHeader('Set-Cookie', 'sierra_id=' + cookies['sierra_id'] + ';');
        }
        let session = new Session(context, cookies['sierra_id'], this.gateway);
        context.session = session;
        return session;
    }
}