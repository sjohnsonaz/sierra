
import Context from './Context';
import { ICookie } from './ICookie';
import { ISessionGateway } from './ISessionGateway'
import { Errors } from './Errors';

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
            throw Errors.noSessionGateway;
        }
        return await this.gateway.save(this.context, this.id, this.data);
    }

    async reload(): Promise<T> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        this.data = await this.gateway.load(this.context, this.id);
        return this.data;
    }

    async destroy(): Promise<boolean> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }

        // Try to remove cookie from client
        let cookie = Session.getCookie(this.context);
        cookie[this.cookieIdentifier] = 'deleted';
        cookie['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
        Session.setCookie(this.context, cookie);

        return await this.gateway.destroy(this.context, this.id);
    }

    async regenerate(): Promise<Session<T>> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        return Session.load(this.context, this.gateway, { regenerate: true });
    }

    touch(): string {
        let cookie = Session.getCookie(this.context);
        let expires = (new Date(Date.now() + 60 * 1000)).toUTCString();
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
            cookieIdentifier: 'sierra_id'
        }, options);
        let {
            cookieIdentifier,
            regenerate
        } = options;

        let cookie = Session.getCookie(context);
        let id = cookie[cookieIdentifier];

        // Do we have a cookie?
        if (regenerate || !id) {
            id = await gateway.getId(context);
            cookie[cookieIdentifier] = id + '; Path=/';
            Session.setCookie(context, cookie);
        }

        // Load data for this id
        let data = await gateway.load(context, id);

        // Create session object for this
        let session = new Session(context, id, gateway, data, cookieIdentifier);
        context.session = session;

        return session;
    }

    static cookieToHash(cookie: string) {
        let entries = cookie ? cookie.split(';').map(entry => entry.trim()) : [];
        let hash: ICookie = {};
        entries.forEach(entry => {
            let parts = entry.split('=');
            if (parts.length === 2 && parts[0] && parts[1]) {
                hash[parts[0]] = parts[1];
            }
        });
        return hash;
    }

    static hashToCookie(hash: ICookie) {
        return Object.keys(hash).map(name => name + '=' + hash[name] + ';').join(' ');
    }

    static hashToCookieArray(hash: ICookie) {
        return Object.keys(hash).map(name => name + '=' + hash[name]);
    }

    static getCookie(context: Context) {
        return Session.cookieToHash(context.request.headers.cookie);
    }

    static setCookie(context: Context, hash: ICookie) {
        context.response.setHeader('Set-Cookie', Session.hashToCookie(hash));
    }
}