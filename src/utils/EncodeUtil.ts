export default class EncodeUtil {
    static objectToUrlString(obj: Object) {
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return values.join('&');
    }

    static urlStringToObject(url: string): {
        [index: string]: string | string[];
    } {
        if (url.startsWith('?')) {
            url = url.substring(1);
        }
        let obj = {};
        url.split('&').forEach(part => {
            let pieces = part.split('=');
            if (pieces.length !== 2) {
                throw 'Cannot parse URI';
            }
            let name = pieces[0];
            let value = pieces[1];
            // If name ends with [], we have an array.
            // If name already exists, we have an array.
            if (name) {
                if (name.endsWith('[]')) {
                    name = name.substr(0, name.length - 2);
                    if (name) {
                        if (!obj[name]) {
                            obj[name] = [];
                        }
                        obj[name].push(decodeURIComponent(value));
                    }
                } else {
                    obj[name] = decodeURIComponent(value);
                }
            }
        });
        return obj;
    }
}