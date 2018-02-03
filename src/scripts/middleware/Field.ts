export default class Field {
    header: string;
    name: string;
    filename: string;
    data: any;
    type: string;

    constructor(header: string) {
        this.header = header;

        let hash = Field.headerToHash(header);
        this.name = hash['name'];
        this.filename = hash['filename'];
        this.data = '';
    }

    addData(data: any) {
        this.data = data;
    }

    setContentType(header: string) {
        let nameParts = header.split(': ');
        if (nameParts) {
            this.type = nameParts[1];
        }
    }

    static headerToHash(header: string) {
        let hash = {};
        let parts = header.split('; ');

        // Header Name
        if (parts && parts[0]) {
            let nameParts = parts[0].split(': ');
            if (nameParts && nameParts.length === 2) {
                hash[nameParts[0]] = nameParts[1];
            }
            parts.shift();
        }

        // Header Data
        parts.forEach(part => {
            let match = part.trim().match(/(.*)=\"(.*)\"/);
            if (match && match.length === 3) {
                hash[match[1]] = match[2];
            }
        });
        return hash;
    }
}