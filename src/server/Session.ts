
import Context from './Context';
import { NoSessionGatewayError } from './Errors';
import { ISessionGateway } from './ISessionGateway';

//const MILLISECONDS = 1;
//const SECONDS = 1000 * MILLISECONDS;
//const MINUTES = 60 * SECONDS;
//const HOURS = 60 * MINUTES;

const SIERRA_ID = 'sierra_id';

export default class Session<T> {
    context: Context;
    id: string;
    gateway: ISessionGateway<T>;
    data: T;
    expires: Date;
    maxAge: number;
    cookieIdentifier: string;

    constructor(context: Context, gateway: ISessionGateway<T>, cookieIdentifier: string = SIERRA_ID) {
        this.context = context;
        this.gateway = gateway;
        this.cookieIdentifier = cookieIdentifier;
    }

    async save(): Promise<boolean> {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }
        return await this.gateway.save(this.context, this.id, this.data);
    }

    async init(maxAge: number = 60) {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }
        const cookie = this.context.cookies.getOrCreateCookie(this.cookieIdentifier);
        if (!cookie.value) {
            const id = await this.gateway.getId(this.context);
            this.id = id;
            cookie.value = id;
            cookie.maxAge = maxAge;
        } else {
            this.id = cookie.value;
            // TODO: Don't update on every call
            cookie.maxAge = maxAge;
        }
        const data = await this.gateway.load(this.context, this.id);
        this.data = data;
    }

    async destroy() {
        if (!this.gateway) {
            throw new NoSessionGatewayError();
        }

        // Try to remove cookie from client
        let cookie = this.context.cookies.getCookie(this.cookieIdentifier);
        if (cookie) {
            cookie.maxAge = -1;
        }

        const id = this.id;
        this.id = undefined;
        return await this.gateway.destroy(this.context, id);
    }

    async regenerate(maxAge = 60) {
        await this.destroy();
        return this.init(maxAge);
    }

    touch(maxAge: number = 60) {
        const cookie = this.context.cookies.getCookie(this.cookieIdentifier);
        cookie.maxAge = maxAge;
        return cookie;
    }

    static async load<T>(
        context: Context,
        gateway: ISessionGateway<T>,
        {
            maxAge = 60,
            cookieIdentifier = SIERRA_ID,
        }: {
            maxAge?: number;
            cookieIdentifier?: string;
        } = {}
    ) {
        // Create session object for this
        const session = new Session(context, gateway, cookieIdentifier);
        await session.init(maxAge);
        context.session = session;
        context.cookies.setCookies(context.response);

        return session;
    }
}
