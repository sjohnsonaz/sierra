import stream, { Stream, Duplex } from 'stream';
import FormDataHeader from './FormDataHeader';

export default class Field {
    header: FormDataHeader;
    name: string;
    fileName: string;
    fileType: string;
    fileStream: Duplex;
    data: any;
    firstLine: boolean = false;
    stashedBuffer: Buffer;

    constructor() {
        this.data = '';
        this.fileStream = new Duplex();
        this.fileStream._read = function () { };
        this.fileStream.on('data', (data) => {
            this.data = data;
        });
    }

    addData(buffer: Buffer) {
        let headerEnd = 0;
        if (!this.header) {
            if (this.stashedBuffer) {
                buffer = Buffer.concat([this.stashedBuffer, buffer]);
            }
            headerEnd = buffer.indexOf('\r\n\r\n');
            if (headerEnd !== -1) {
                this.createHeader(buffer.slice(0, headerEnd).toString().trim());
                this.stashedBuffer = undefined;
            } else {
                this.stashedBuffer = buffer;
            }
        }
        console.log('header object:', this.header);
        if (this.header) {
            let data = headerEnd > 0 ? buffer.slice(headerEnd + 4) : buffer;
            if (this.fileName) {
                this.fileStream.push(data)
            } else {
                this.data = data;
            }
        }
    }

    private createHeader(row: string) {
        console.log('header:', row);
        this.header = FormDataHeader.create(row);
        let contentDisposition = this.header.contentDisposition;
        console.log('disposition:', contentDisposition);
        if (contentDisposition) {
            this.name = contentDisposition.hash['name'];
            this.fileName = contentDisposition.hash['filename'];
        }
        this.fileType = this.header.contentType;
    }

    /*
    private getRowEnd(buffer: Buffer, start?: number) {
        return buffer.indexOf('\r\n', start);
    }

    private getRow(buffer: Buffer, start?: number, end?: number) {
        return buffer.slice(start, end).toString().trim();
    }
    */
}