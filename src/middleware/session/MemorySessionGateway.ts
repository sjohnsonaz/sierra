import Context from '../../server/Context';

import { ISessionGateway } from '../../server/ISessionGateway';
import Uuid from '../../utils/Uuid';
export default class MemorySessionGateway<T> implements ISessionGateway<T> {
    data: {
        [index: string]: T;
    } = {};

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