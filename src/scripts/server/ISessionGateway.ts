import Context from './Context';

export interface ISessionGateway<T> {
    getId(context: Context): Promise<string>;
    load(context: Context, id: string): Promise<T>;
    save(context: Context, id: string, data: T): Promise<boolean>;
    destroy(context: Context, id: string): Promise<boolean>;
    regenerate(context: Context, id: string): Promise<T>;
    reload(context: Context, id: string): Promise<T>;
    touch(context: Context, id: string): Promise<boolean>;
}