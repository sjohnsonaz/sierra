import { IPipelineContext } from "./IPipelineContext";
import { Pipeline } from "./Pipeline";

export abstract class Switch<T extends IPipelineContext, U, V> {
    pipelines: Record<string, Pipeline<T, U, V>> = {};

    async run(context: T, value: U): Promise<V> {
        const name = await this.handle(context, value);
        const pipeline = this.pipelines[name];
        if (!pipeline) {
            throw 'no pipeline found';
        }
        return pipeline.run(context, value);
    }

    abstract async handle(context: T, value: U): Promise<string>;
}
