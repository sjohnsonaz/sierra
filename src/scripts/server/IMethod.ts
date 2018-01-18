export interface IMethod<T> {
    (...args: any[]): Promise<T>;
}