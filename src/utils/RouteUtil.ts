const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export function getParameterNames(functionHandle: Function) {
    let definition = functionHandle.toString().replace(STRIP_COMMENTS, '');
    if (definition.startsWith('function')) {
        // We have a standard function
        return definition.slice(definition.indexOf('(') + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
    } else {
        // We have an arrow function
        let arrowIndex = definition.indexOf('=>');
        let parenthesisIndex = definition.indexOf('(');
        if (parenthesisIndex > -1 && parenthesisIndex < arrowIndex) {
            return definition.slice(parenthesisIndex + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
        } else {
            return definition.slice(0, arrowIndex).match(/([^\s,]+)/g) || [];
        }
    }
}

export function getArgumentNames(func: Function) {
    // First match everything inside the function argument parens.
    const matches = func.toString()
        .match(/function\s.*?\(([^)]*)\)\s*{|\(([^)]*)\)\s*=>\s*{|[_$a-zA-Z][_$\w\d]*\(([^)]*)\)\s*{/);
    const args = matches[1] || matches[2] || matches[3] || '';

    // Split the arguments string into an array comma delimited.
    return args.split(',')
        // Ensure no inline comments are parsed and trim the whitespace.
        .map(function (value: string) {
            return value.replace(/\/\*.*\*\//, '').trim();
        })
        // Ensure no undefined values are added.
        .filter(function (value: string) {
            return !!value;
        });
}

export function stringToRegex(definition: string): RegExp {
    return new RegExp('^' + definition.replace(/\//g, '\\/').replace(/:(\w*)/g, '([\^\/]*)') + '$', 'i');
}

export function functionToRegex(prefix: string, enter: Function): RegExp {
    const params = getParameterNames(enter);
    params.unshift(prefix);
    return stringToRegex(params.join('/:'));
}