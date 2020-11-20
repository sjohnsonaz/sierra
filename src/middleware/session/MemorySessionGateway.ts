import { Context } from '../../server';
import { Uuid } from '../../utils/Uuid';
import { ISessionGateway } from './ISessionGateway';

export class MemorySessionGateway<T extends { _id: string }> implements ISessionGateway<T> {
    data: Record<string, T> = {};

    async getId(context: Context): Promise<string> {
        return Uuid.create();
    }

    async load(context: Context, id: string): Promise<T> {
        return this.data[id] || ({ _id: id } as any);
    }

    async save(context: Context, id: string, data: T): Promise<boolean> {
        if (!id) {
            id = Uuid.create();
        }
        if (!data['_id']) {
            data['_id'] = id;
        }
        this.data[id] = data;
        return true;
    }

    async destroy(context: Context, id: string): Promise<boolean> {
        delete this.data[id];
        return true;
    }

    async regenerate(context: Context, id: string): Promise<T> {
        return this.data[id] || ({ _id: id } as any);
    }

    async reload(context: Context, id: string): Promise<T> {
        return this.data[id] || ({ _id: id } as any);
    }

    async touch(context: Context, id: string): Promise<boolean> {
        return true;
    }
}