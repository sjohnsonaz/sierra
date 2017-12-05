const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export default class RouteUtils {
    static getParameterNames(functionHandle: Function) {
        var definition = functionHandle.toString().replace(STRIP_COMMENTS, '');
        return definition.slice(definition.indexOf('(') + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
    }

    static stringToRegex(definition: string): RegExp {
        return new RegExp('^' + definition.replace(/\//g, '\\/').replace(/:(\w*)/g, '([\^S\^\/]*)') + '$');
    }

    static functionToRegex(prefix: string, enter: Function): RegExp {
        var params = RouteUtils.getParameterNames(enter);
        params.unshift(prefix);
        return RouteUtils.stringToRegex(params.join('/:'));
    }
}