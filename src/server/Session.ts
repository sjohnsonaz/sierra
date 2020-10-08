
import Context from './Context';
import Cookie from './Cookie';
import { NoSessionGatewayError } from './Errors';
import { ISessionGateway } from './ISessionGateway';

const MILLISECONDS = 1000;
const SECONDS = 60;

export default class Session<T> {
    context: Context;
    id: string;
    gateway: ISessionGateway<T>;
    data: T;
    expires: Date;
    maxAge: number;
    cookieIdentifier: string;

    constructor(context: Context, id: string, gateway: ISessionGateway<T>, data?: T, cookieIdentifier?: string) {
        this.context = context;
        this.id = id;
        this.gateway = gateway;
        this.data = data;
        this.cookieIdentifier = cookieIdentifier;
    }

    async save(): Promise<boolean> {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }
        return await this.gateway.save(this.context, this.id, this.data);
    }

    async reload(): Promise<T> {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }
        this.data = await this.gateway.load(this.context, this.id);
        return this.data;
    }

    async destroy(): Promise<boolean> {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }

        // Try to remove cookie from client
        let cookie = Cookie.getCookie(this.context);
        cookie[this.cookieIdentifier] = '';
        cookie['path'] = '/';
        cookie['expires'] = (new Date(Date.now() + 60 * 60 * 1000)).toUTCString();
        Cookie.setCookie(this.context, cookie);

        return await this.gateway.destroy(this.context, this.id);
    }

    async regenerate(): Promise<Session<T>> {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }
        return Session.load(this.context, this.gateway, { regenerate: true });
    }

    touch(minutes: number = 60, now: number = Date.now()): string {
        let cookie = Cookie.getCookie(this.context);
        let expires = (new Date(now + MILLISECONDS * SECONDS * minutes)).toUTCString();
        cookie['expires'] = expires;
        return expires;
    }

    static async load<T>(context: Context, gateway: ISessionGateway<T>, options?: Partial<{
        data: T;
        expires: Date;
        maxAge: number;
        cookieIdentifier: string;
        regenerate: boolean;
    }>) {
        options = Object.assign({
            cookieIdentifier: 'sierra_id',
            expires: (new Date(Date.now() + 60 * 60 * 24))
        }, options);
        let {
            cookieIdentifier,
            regenerate
        } = options;

        let cookie = Cookie.getCookie(context);
        let id = cookie[cookieIdentifier];

        // Do we have a cookie?
        if (regenerate || !id) {
            id = await gateway.getId(context);
            cookie[cookieIdentifier] = id;
            cookie['path'] = '/';
            cookie['expires'] = options.expires.toUTCString();
            Cookie.setCookie(context, cookie);
        }

        // Load data for this id
        let data = await gateway.load(context, id);

        // Create session object for this
        let session = new Session(context, id, gateway, data, cookieIdentifier);
        context.session = session;

        return session;
    }
}