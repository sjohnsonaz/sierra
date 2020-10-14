
import { Context, Session, ISessionGateway } from '../../server';

export class SessionMiddleware<T> {
    gateway: ISessionGateway<any>;

    constructor(gateway: ISessionGateway<any>) {
        this.gateway = gateway;
    }

    handle = async (context: Context) => {
        await Session.load(context, this.gateway);
    }
}
