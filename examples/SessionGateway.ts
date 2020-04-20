import { Context, ISessionGateway, Uuid } from '../src/Sierra';

export default class SessionGateway implements ISessionGateway<any> {
    async getId(context: Context): Promise<string> {
        return Uuid.create();
    }

    async load(context: Context, id: string): Promise<any> {
        return {
            id: id
        };
    }

    async save(context: Context, id: string, data: any): Promise<boolean> {
        return true;
    }

    async destroy(context: Context, id: string): Promise<boolean> {
        return true;
    }

    async regenerate(context: Context, id: string): Promise<any> {
        return {
            id: id
        };
    }

    async reload(context: Context, id: string): Promise<any> {
        return {
            id: id
        };
    }

    async touch(context: Context, id: string): Promise<boolean> {
        return true;
    }
}