
import Context from './Context';
import { ICookie } from './ICookie';
import { ISessionGateway } from './ISessionGateway'

export default class Session<T> {
    context: Context;
    uuid: string;
    gateway: ISessionGateway<T>;
    private _data: T;
    get data() {
        return this.load(this.context, this.uuid);
    }

    constructor(context: Context, uuid: string, gateway: ISessionGateway<T>) {
        this.context = context;
        this.uuid = uuid;
    }

    async load(context: Context, uuid: string): Promise<T> {
        if (!this._data) {
            this._data = await this.gateway.load(context, uuid);
        }
        return this._data;
    }

    async save(context: Context, uuid: string): Promise<boolean> {
        return await this.gateway.save(context, uuid);
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