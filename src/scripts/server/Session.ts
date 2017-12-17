
import Context from './Context';
import { ICookie } from './ICookie';
import { ISessionGateway } from './ISessionGateway'
import { Errors } from './Errors';

export default class Session<T> {
    context: Context;
    id: string;
    gateway: ISessionGateway<T>;
    private _data: T;

    constructor(context: Context, id: string, gateway: ISessionGateway<T>) {
        this.context = context;
        this.id = id;
        this.gateway = gateway;
    }

    async load(): Promise<T> {
        if (!this._data) {
            if (!this.gateway) {
                throw Errors.noSessionGateway;
            }
            this._data = await this.gateway.load(this.context, this.id);
        }
        return this._data;
    }

    async save(): Promise<boolean> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        return await this.gateway.save(this.context, this.id, this._data);
    }

    async destroy(): Promise<boolean> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        return await this.gateway.destroy(this.context, this.id);
    }

    async regenerate(): Promise<T> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        return await this.gateway.regenerate(this.context, this.id);
    }

    async reload(): Promise<T> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        return await this.gateway.reload(this.context, this.id);
    }

    async touch(): Promise<boolean> {
        if (!this.gateway) {
            throw Errors.noSessionGateway;
        }
        return await this.gateway.touch(this.context, this.id);
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
}