import * as http from 'http';

interface IRequest extends http.IncomingMessage {
    query?: Record<string, any>;
    params?: Record<string, any>;
    body?: Record<string, any>;
}

export function getArgumentNames(func: Function) {
    // First match everything inside the function argument parens.
    var matches = func.toString().match(/function\s.*?\(([^)]*)\)\s*{|\(([^)]*)\)\s*=>\s*{|[_$a-zA-Z][_$\w\d]*\(([^)]*)\)\s*{/);
    var args = matches[1] || matches[2] || matches[3] || '';

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function (value: string, index: number, array: string[]) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return value.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (value: string, index: number, array: string[]) {
        // Ensure no undefined values are added.
        return !!value;
    });
}

export function injectVariables(method: Function, context: Object) {
    var newBody = [];

    for (var k in context) {
        var i = "var " + k + " = context['" + k + "'];";
        newBody.push(i);
    }
    var res = 'return ' + method.toString() + ';';
    newBody.push(res);
    var F = new Function("context", newBody.join('\n'));
    return F(context);
}

// TODO: Determine if this is still needed
export function wrapMethod(method: Function, thisArg: any) {
    var argumentNames = getArgumentNames(method);
    var wrappedMethod = function (req: IRequest, res: http.ServerResponse, next?: (err?: any) => any) {
        var args = [];
        for (var index = 0, length = argumentNames.length; index < length; index++) {
            var argumentName = argumentNames[index];
            var arg = req.params[argumentName] || req.query[argumentName] || req.body[argumentName];
            args.push(arg);
        }
        var injectedMethod = injectVariables(method, {
            req: req,
            res: res,
            next: next
        });
        injectedMethod.apply(method, args);
    }
    return wrappedMethod;
}
