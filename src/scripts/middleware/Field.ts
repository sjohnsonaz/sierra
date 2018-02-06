import stream, { Stream, Duplex } from 'stream';

export default class Field {
    header: string;
    name: string;
    fileName: string;
    fileType: string;
    fileStream: Duplex;
    data: any;

    constructor(header: string) {
        this.header = header;

        let hash = Field.headerToHash(header);
        this.name = hash['name'];
        this.fileName = hash['filename'];
        this.data = '';
        this.fileStream = new Duplex();
        this.fileStream._read = function () { };
        this.fileStream.on('data', (data) => {
            this.data = data;
        });
    }

    addData(data: any) {
        if (this.fileName) {
            this.fileStream.push(data)
        } else {
            this.data = data;
        }
    }

    setContentType(header: string) {
        let nameParts = header.split(': ');
        if (nameParts) {
            this.fileType = nameParts[1];
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