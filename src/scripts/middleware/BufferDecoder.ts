import Field from './Field';

export default class BuferDecoder {
    boundary: string;
    boundaryEnd: string;
    boundaryLength: number;
    bufferRemainder: Buffer;
    fields: Field[] = [];
    currentField: Field;
    firstChunk: boolean = true;

    constructor(httpBoundary: string) {
        this.boundary = '--' + httpBoundary;
        this.boundaryEnd = httpBoundary + '--';
        this.boundaryLength = this.boundary.length;
    }

    decode() {
        let result: Object = {};
        this.fields.forEach(field => {
            if (field.name) {
                if (field.fileName) {
                    result[field.name] = {
                        filename: field.fileName,
                        data: field.data,
                        type: field.fileType
                    };
                } else {
                    result[field.name] = field.data;
                }
            }
        });

        return result;
    }

    addData(buffer: Buffer) {
        let currentBuffer = buffer;
        if (this.bufferRemainder) {
            currentBuffer = Buffer.concat([this.bufferRemainder, buffer]);
        }
        let nextIndex = this.parseBuffer(currentBuffer);
        this.bufferRemainder = currentBuffer.slice(nextIndex);
    }

    private parseBuffer(buffer: Buffer) {
        let length = buffer.length;
        let index = 0;
        if (this.firstChunk) {
            index = buffer.indexOf(this.boundary, 0, 'ascii') + this.boundaryLength;
            this.firstChunk = false;
        }
        while (index < length) {
            let firstIndex = index;
            let nextIndex = buffer.indexOf(this.boundary, firstIndex, 'ascii');
            if (nextIndex === -1) {
                break;
            }
            let bufferPart = buffer.slice(firstIndex, nextIndex - 1);

            this.currentField = this.createField(bufferPart);
            this.fields.push(this.currentField);

            index = nextIndex + this.boundaryLength;
        }
        return index;
    }

    private createField(buffer: Buffer) {
        let field: Field;
        let data = buffer.toString().trim();
        let lines = data.split('\r\n');

        let dispositionIndex = buffer.indexOf('Content-Disposition');
        let dispositionEnd = buffer.indexOf('\r\n', dispositionIndex);
        let dispositionRow = buffer.slice(dispositionIndex, dispositionEnd).toString().trim();

        //console.log('disposition:', dispositionIndex, dispositionEnd, dispositionRow);
        field = new Field(dispositionRow);

        let contentStart;

        let typeIndex = buffer.indexOf('Content-Type');
        if (typeIndex !== -1) {
            let typeEnd = buffer.indexOf('\r\n', typeIndex);
            let typeRow = buffer.slice(typeIndex, typeEnd).toString().trim();

            field.setContentType(typeRow);
            //console.log('type:', typeIndex, typeEnd, typeRow);

            contentStart = typeEnd + 4;
        } else {
            contentStart = dispositionEnd + 4;
        }
        field.addData(buffer.slice(contentStart));

        return field;
    }
}