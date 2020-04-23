import { IMiddleware } from './IMiddleware';
import { IPipelineContext } from './IPipelineContext';

export class PipelineExit {

}

export function exit() {
    return new PipelineExit();
}

export default class Pipeline<T extends IPipelineContext, U, V> {
    middlewares: IMiddleware<T, any, any>[] = [];
    // TODO: Should context be optional?
    async run(context: T, value?: U) {
        let result: V = value as any;
        for (let index = 0, length = this.middlewares.length; index < length; index++) {
            result = await this.middlewares[index](context, result);
            if (result instanceof PipelineExit) {
                break;
            }
        }
        return result;
    }

    use(middlware: IMiddleware<T, any, any>) {
        this.middlewares.push(middlware);
    }

    remove(middleware: IMiddleware<T, any, any>) {
        let index = this.middlewares.indexOf(middleware);
        if (index >= 0) {
            return this.middlewares.splice(index, 1);
        } else {
            return [];
        }
    }
}