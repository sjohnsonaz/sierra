export function encode(obj: Record<string, any>) {
    const entries: Entry[] = [];
    for (let name in obj) {
        if (obj.hasOwnProperty(name)) {
            const value = obj[name];
            const key = encodeURIComponent(name);
            createEntries(key, value, entries);
        }
    }
    return entries.join('&');
}

class Entry<T extends boolean | number | string | null = boolean | number | string | null> {
    key: string;
    value: T;

    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
    }

    toString() {
        const value = this.value === null ? 'null' : this.value.toString();
        return `${this.key}=${encodeURIComponent(value)}`;
    }
}

function createEntries<T>(name: string, value: T, output: Entry[]) {
    switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
            createPrimitiveEntry(name, value, output);
            break;
        case 'object':
            if (value === null) {
                createPrimitiveEntry(name, value as any, output);
            } else if (value instanceof Array) {
                createArrayEntries(name, value, output);
            } else {
                createObjectEntries(name, value, output);
            }
            break;
    }
    return output;
}

function createPrimitiveEntry<T extends boolean | number | string | null>(name: string, value: T, output: Entry[]) {
    output.push(new Entry(name, value));
}

function createArrayEntries<T>(name: string, array: T[], output: Entry[]) {
    const key = `${name}[]`;
    for (let item of array) {
        createEntries(key, item, output);
    }
    return output;
}

function createObjectEntries(name: string, obj: Record<string, any>, output: Entry[]) {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            const value = obj[property];
            const key = `${name}[${encodeURIComponent(property)}]`;
            createEntries(key, value, output);
        }
    }
    return output;
}
