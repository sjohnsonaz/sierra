import { Middleware, Pipeline } from '../../pipeline';
import { Context, Verb } from '../../server';

export class Route<VALUE, RESULT> {
    pipeline: Pipeline<Context, VALUE, RESULT> = new Pipeline();
    readonly verbs: Verb[];
    readonly name: string | RegExp;
    readonly regex: RegExp;
    readonly method: Middleware<Context, any, any>;
    readonly parameters: string[];
    // TODO: Should template be on Route?
    readonly template?: string;
    /**
      * If `name` is a RegExp, `firstParamIndex` is -1
      * 
      * Otherwise, `firstParamIndex` is the index of the first parameter in `name`
      */
    readonly firstParamIndex: number = 0;

    constructor(
        verbs: Verb | Verb[],
        name: string | RegExp,
        method: Middleware<Context, any, any>,
        template?: string,
    ) {
        this.verbs = verbs instanceof Array ? verbs : [verbs];
        this.name = name;
        if (name instanceof RegExp) {
            this.regex = name;
            this.parameters = [];
            this.firstParamIndex = -1;
        } else {
            const directories = name
                .replace('\\', '/')
                .split('/');
            const parts = directories
                .map(directory => directory.startsWith(':') ? '([\^\/]*)' : directory);
            const index = directories
                .findIndex(part => part.startsWith(':'));
            this.regex = new RegExp(`^\\/${parts.join('\\/')}$`, 'i');
            this.parameters = directories
                .filter(directory => directory.startsWith(':'))
                .map(directory => directory.substr(1));
            this.firstParamIndex = index >= 0 ? index : 0;
        }
        this.method = method;
        this.template = template;
    }

    match(verb: Verb, pathname: string) {
        if (this.verbs.indexOf(verb) >= 0) {
            return pathname.match(this.regex);
        } else {
            return null;
        }
    }

    getParams(match: null | RegExpMatchArray) {
        const params: Record<string, string> = {};
        if (match) {
            this.parameters.forEach((name, index) => {
                params[name] = match[index + 1];
            });
        }
        return Object.freeze(params);
    }

    run(context: Context, value: VALUE, match: null | RegExpMatchArray) {
        context.template = context.template || this.template;
        context.data.params = this.getParams(match);
        const result = this.pipeline.run(context, value);
        return this.method(context, result);
    }
}
