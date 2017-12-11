import Context from './Context';

export interface ISessionGateway<T> {
    load(context: Context, uuid: string): Promise<T>;
    save(context: Context, uuid: string): Promise<boolean>;
}