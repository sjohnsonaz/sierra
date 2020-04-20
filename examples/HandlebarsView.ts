import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';

import { Context } from '../src/Sierra';

export default class HandlebarsView {
    static viewRoot: string = ''
    static async handle<T>(context: Context, data: T, template?: string): Promise<string> {
        let templateFile = path.join(HandlebarsView.viewRoot, template) + '.handlebars';
        try {
            var templateText = await new Promise((resolve, reject) => {
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
            throw 'Cannot find template: ' + template + '.handlebars';
        }
        var compiledTemplate = Handlebars.compile(templateText);
        return compiledTemplate(data);
    }
}