export function objectToUrlString(obj: Object) {
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

export function urlStringToObject(url: string): Record<string, string | string[]> {
    let data: Record<string, string | string[]> = {};
    url.split('&').forEach(part => {
        let pieces = part.split('=');
        if (pieces.length !== 2) {
            throw 'Cannot parse URI';
        }
        let name = pieces[0];
        let value = pieces[1];
        if (name) {
            // If name ends with [], we have an array.
            if (name.endsWith('[]')) {
                name = name.substr(0, name.length - 2);
                if (name) {
                    if (!data[name]) {
                        data[name] = [];
                    }
                } else {
                    return;
                }
            }
            value = decodeURIComponent(value);
            let valueArray = value.split(',');
            if (valueArray.length > 1) {
                // If name already exists, we have an array.
                let entry = data[name];
                if (entry) {
                    if (!(entry instanceof Array)) {
                        data[name] = [entry];
                    }
                    valueArray.forEach(value => {
                        (entry as string[]).push(value);
                    });
                } else {
                    data[name] = valueArray;
                }
            } else {
                // If name already exists, we have an array.
                let entry = data[name];
                if (entry) {
                    if (!(entry instanceof Array)) {
                        data[name] = [entry, value];
                    } else {
                        (entry as string[]).push(value);
                    }
                } else {
                    data[name] = value;
                }
            }
        }
    });
    return data;
}

export function updateUrlStringObject(url: string, obj: Object): string {
    const index = url.indexOf('?');
    const base = url.substring(0, index);
    url = url.substring(index + 1);
    const data = urlStringToObject(url);
    const merged = Object.assign({}, data, obj);
    return base + '?' + objectToUrlString(merged);
}
