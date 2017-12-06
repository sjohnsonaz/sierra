import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';

import { Context } from '../scripts/Sierra';

export default class HandlebarsView {
    static viewRoot: string = ''
    static async handle(context: Context, data, template: string) {
        let templateFile = path.join(HandlebarsView.viewRoot, template) + '.handlebars';
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
        var compiledTemplate = Handlebars.compile(templateText);
        return compiledTemplate(data);
    }
}