
import Context from '../../server/Context';
import Session from '../../server/Session';
import { ISessionGateway } from '../../server/ISessionGateway';

export default class SessionMiddleware<T> {
    gateway: ISessionGateway<any>;

    constructor(gateway: ISessionGateway<any>) {
        this.gateway = gateway;
    }

    handle = async (context: Context) => {
        await Session.load(context, this.gateway);
    }
}