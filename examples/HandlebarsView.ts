import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';

import { Context } from '../src/Sierra';
import { NoViewTemplateError } from '../src/server/Errors';

export default class HandlebarsView {
    static viewRoot: string = ''
    static async handle<T>(context: Context, data: T, template?: string): Promise<string> {
        let templateFile = path.join(HandlebarsView.viewRoot, template) + '.handlebars';
        let templateText: string;
        try {
            templateText = await new Promise<string>((resolve, reject) => {
                fs.readFile(templateFile, {
                    encoding: 'utf8'
                }, (err, data: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
        catch {
            throw new NoViewTemplateError(`${template}.handlebars`);
        }
        const compiledTemplate = Handlebars.compile(templateText);
        return compiledTemplate(data);
    }
}