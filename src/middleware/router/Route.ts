import * as path from 'path';

import { Middleware, Pipeline } from '../../pipeline';
import { Context, Verb } from '../../server';

export class Route<VALUE, RESULT> {
    pipeline: Pipeline<Context, VALUE, RESULT> = new Pipeline();
    readonly verbs: Verb[];
    readonly name: string | RegExp;
    readonly method: Middleware<Context, any, any>;
    // TODO: Should template be on Route?
    readonly template?: string;

    config?: {
        readonly regex: RegExp;
        readonly parameters: string[];
        /**
          * If `name` is a RegExp, `firstParamIndex` is -1
          * 
          * Otherwise, `firstParamIndex` is the index of the first parameter in `name`
          */
        readonly firstParamIndex: number;
    }

    constructor(
        verbs: Verb | Verb[],
        name: string | RegExp,
        method: Middleware<Context, any, any>,
        template?: string,
    ) {
        this.verbs = verbs instanceof Array ? verbs : [verbs];
        this.name = name;
        this.method = method;
        this.template = template;
    }

    init(base?: string) {
        if (this.name instanceof RegExp) {
            this.config = {
                regex: this.name,
                parameters: [],
                firstParamIndex: -1
            };
        } else {
            const name = getName(base, this.name);
            const directories = name
                .replace('\\', '/')
                .split('/');
            const parts = directories
                .map(directory => directory.startsWith(':') ? '([\^\/]*)' : directory);
            const index = directories
                .findIndex(part => part.startsWith(':'));
            const regex = new RegExp(`^${parts.join('\\/')}$`, 'i');
            const parameters = directories
                .filter(directory => directory.startsWith(':'))
                .map(directory => directory.substr(1));
            const firstParamIndex = index >= 0 ? index : 0;
            this.config = {
                regex,
                parameters,
                firstParamIndex
            };
        }
    }

    match(verb: Verb, pathname: string) {
        // TODO: Remove this.config undefined check
        if (this.verbs.indexOf(verb) >= 0 && this.config) {
            return pathname.match(this.config.regex);
        } else {
            return null;
        }
    }

    getParams(match: null | RegExpMatchArray) {
        const params: Record<string, string> = {};
        if (match) {
            this.config?.parameters.forEach((name, index) => {
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

function getName(base: string = '', name: string) {
    if (name.startsWith('~')) {
        name = name.substr(1);
        return path.posix.join('/', name);
    } else {
        base = base.replace('\\', '/');
        return path.posix.join('/', base, name);
    }
}
