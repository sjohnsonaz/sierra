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
        // Do we not have a header?
        if (!this.header) {
            // We need to find a header
            if (this.stashedBuffer) {
                // We have stashed buffer content
                // Concatenate the stash with buffer
                buffer = Buffer.concat([this.stashedBuffer, buffer]);
            }

            // Find the end of the header
            headerEnd = buffer.indexOf('\r\n\r\n');

            if (headerEnd !== -1) {
                // We found the end of the header
                // Create the header with the buffer
                this.createHeader(buffer.slice(0, headerEnd).toString().trim());
                // Store the remainder of the buffer into buffer
                buffer = buffer.slice(headerEnd + 4);
                this.stashedBuffer = undefined;
            } else {
                // We haven't found the end of the header
                // Stash the buffer
                this.stashedBuffer = buffer;
            }
        }
        // Do we have a header
        if (this.header) {
            // We have a header
            let data = buffer;
            if (this.fileName) {
                this.fileStream.push(data)
            } else {
                this.data = data;
            }
        }
    }

    private createHeader(row: string) {
        this.header = FormDataHeader.create(row);
        let contentDisposition = this.header.contentDisposition;
        if (contentDisposition) {
            this.name = contentDisposition.hash['name'];
            this.fileName = contentDisposition.hash['filename'];
        }
        this.fileType = this.header.contentType;
    }
}