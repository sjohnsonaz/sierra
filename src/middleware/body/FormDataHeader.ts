export class FormDataHeader {
    rawHeaders: {
        [index: string]: string;
    } = {};

    get contentType() {
        return this.rawHeaders['Content-Type'];
    }

    get contentDisposition() {
        let row = this.rawHeaders['Content-Disposition'];
        if (row) {
            let parts = row.split('; ');
            let name = parts[0];
            let hash: Record<string, any> = {};
            if (parts.length > 1) {
                parts.shift();

                // Header Data
                parts.forEach(part => {
                    let match = part.trim().match(/(.*)=\"(.*)\"/);
                    if (match && match.length === 3) {
                        hash[match[1]] = match[2];
                    }
                });
            }
            return {
                name: name,
                hash: hash
            };
        }
    }

    static create(headerText: string) {
        let header = new FormDataHeader();

        let rows = headerText.split('\r\n');
        if (rows.length) {
            rows.forEach(row => {
                let parts = row.split(': ');
                if (parts.length === 2) {
                    header.rawHeaders[parts[0]] = parts[1];
                }
            });
        }
        return header;
    }
}