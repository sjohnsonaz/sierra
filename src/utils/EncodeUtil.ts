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

    static urlStringToObject(url: string) {
        if (url.startsWith('?')) {
            url = url.substring(1);
        }
        let obj: Object = {};
        url.split('&').forEach(part => {
            let pieces = part.split('=');
            if (pieces.length !== 2) {
                throw 'Cannot parse URI';
            }
            let name = pieces[0];
            let value = pieces[1];
            obj[name] = decodeURIComponent(value);
        });
        return obj;
    }
}