import { Context } from '../../server';

export interface ISessionGateway<T> {
    getId(context: Context): Promise<string>;
    load(context: Context, id: string): Promise<T>;
    save(context: Context, id: string, data: T): Promise<boolean>;
    destroy(context: Context, id: string): Promise<boolean>;
}