export interface DecodedQuery {
    [index: string]: DecodeValue;
    [index: number]: DecodeValue;
}

type DecodeValue = string | DecodeValue[] | DecodedQuery;

export function decode(queryString: string) {
    const graphEntries = createEntries(queryString);
    const graphNode = createNodes(graphEntries);
    return graphNode.decode();
}

function createEntries(query: string) {
    const entries: GraphEntry[] = [];
    const parts = query.split('&');
    for (let part of parts) {
        let pieces = part.split('=');
        if (pieces.length !== 2) {
            continue;
        }
        let key = pieces[0];
        let value = pieces[1];
        if (!key) {
            continue;
        }
        entries.push(new GraphEntry(key, value));
    }
    return entries;
}

function createNodes(graphEntries: GraphEntry[]) {
    const root = new GraphNode();
    graphEntries.forEach(entry => {
        root.addEntry(entry);
    });
    return root;
}

class GraphEntry {
    key: string;
    keys: string[];
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.keys = this.parseKey(key);
        this.value = value;
    }

    static regex = /[a-zA-Z0-9\-\_\.\!\~\*\'\(\)\%]+|\[\]/g;
    private parseKey(key: string) {
        const matches = key.match(GraphEntry.regex);
        return matches?.map(match => {
            switch (match) {
                case '[]':
                    return '';
                default:
                    return match;
            }
        }) || [];
    }
}

class GraphNode {
    values: string[] = [];
    children: Record<string, GraphNode> = {};

    addValue(value: string) {
        const values = value.split(',');
        for (let value of values) {
            this.values.push(decodeURIComponent(value));
        }
    }

    addEntry(graphEntry: GraphEntry, index = 0) {
        const key = graphEntry.keys[index];
        let node = this.children[key];
        if (!node) {
            node = new GraphNode();
            this.children[key] = node;
        }
        index++
        if (graphEntry.keys.length === index) {
            node.addValue(graphEntry.value);
        } else {
            node.addEntry(graphEntry, index);
        }
    }

    decode() {
        const output: DecodedQuery = this.createOutput() as any;
        return output;
    }

    createOutput() {
        const keys = Object.keys(this.children);
        const outputObject: DecodedQuery = {};
        const outputArray: DecodeValue[] = [];
        keys.forEach(key => {
            const entry = this.children[key];
            if (key === '') {
                outputArray.push(entry.createOutput());
            } else {
                outputObject[key] = entry.createOutput();
            }
        });
        this.values.forEach(value => {
            outputArray.push(value);
        });
        if (outputArray.length) {
            if (Object.keys(outputObject).length) {
                throw 'Cannot parse';
            } else {
                return outputArray.length > 1 ? outputArray : outputArray[0];
            }
        } else {
            return outputObject;
        }
    }
}
