export function encode(obj: Record<string, any>) {
    //const entries = createEntries(obj);
}

export function createEntry<T extends number | string>(key: string, value: T) {
    return {
        key,
        value
    };
}

export function createEntries<T>(name: string, value: T, output: ReturnType<typeof createEntry>[] = [], prefix?: string) {
    switch (typeof value) {
        case 'number':
        case 'string':
            const key = prefix ? `${prefix}[${name}]` : name;
            output.push(createEntry(key, value));
            break;
        case 'object':
            if (value instanceof Array) {
                const key = prefix ? `${prefix}[${name}]` : name;
                createArrayEntries(key, value, output);
            } else {
                const key = prefix ? `${prefix}[${name}]` : name;
                createObjectEntries(key, value, output);
            }
            break;
    }
    return output;
}

function createArrayEntries<T>(name: string, array: T[], output: ReturnType<typeof createEntry>[] = []) {
    const key = `${name}[]`;
    for (let item of array) {
        createEntries(key, item, output);
    }
    return output;
}

function createObjectEntries(name: string, obj: Record<string, any>, output: ReturnType<typeof createEntry>[] = []) {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            const value = obj[property];
            const key = `${name}[${property}]`;
            createEntries(key, value, output);
        }
    }
    return output;
}
