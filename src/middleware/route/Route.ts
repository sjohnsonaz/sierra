import * as path from 'path';

import { Middleware, Pipeline } from '../../pipeline';
import { Context, Verb } from '../../server';

export class Route<VALUE, RESULT> {
    pipeline: Pipeline<Context, VALUE, RESULT> = new Pipeline();
    readonly verbs: Verb[];
    readonly name: string | RegExp;
    readonly method: Middleware<Context, any, any>;
    // TODO: Should template be on Route?
    // TODO: Should this be readonly?
    template?: string;

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
                firstParamIndex: -2
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
            const regex = new RegExp(`^\\/${parts.join('\\/')}$`, 'i');
            const parameters = directories
                .filter(directory => directory.startsWith(':'))
                .map(directory => directory.substr(1));
            const firstParamIndex = index;
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

    async run(context: Context, value: VALUE, match: null | RegExpMatchArray) {
        context.template = context.template || this.template;
        context.data.params = this.getParams(match);
        const result = await this.pipeline.run(context, value);
        return this.method(context, result);
    }
}

/**
 * If `name` starts with `"~"`, do nothing.
 * 
 * Otherwise, join `base` and `name`.
 * 
 * Result must not end in `"/"`.
 * 
 * @param base 
 * @param name 
 */
function getName(base: string = '', name: string) {
    let result: string;
    if (name.startsWith('~')) {
        name = name.substr(1);
        result = path.posix.join(name);
    } else {
        base = base.replace('\\', '/');
        result = path.posix.join(base, name);
    }
    if (result.startsWith('/')) {
        result = result.substr(1);
    }
    if (result.endsWith('/')) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}
