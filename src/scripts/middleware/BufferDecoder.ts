import Field from './Field';
import Boundary from './Boundary';

export default class BufferDecoder {
    boundary: string;
    //boundaryEnd: string;
    boundaryLength: number;
    bufferRemainder: Buffer;
    bufferRemainderLength
    fields: Field[] = [];
    currentField: Field;
    firstChunk: boolean = true;

    constructor(httpBoundary: string) {
        this.boundary = '--' + httpBoundary;
        //this.boundaryEnd = httpBoundary + '--';
        // Add two to the end for the '--'
        this.boundaryLength = this.boundary.length + 2;
        this.bufferRemainder = Buffer.alloc(this.boundaryLength);
    }

    addData(buffer: Buffer) {
        buffer = this.unStash(buffer);
        let boundaries = Boundary.getBoundaries(buffer, this.boundary);
        if (!boundaries.length) {
            // All data goes to the last Field
            if (this.currentField) {
                this.currentField.addData(this.stash(buffer));
            }
        } else {
            let previousBoundary: Boundary = undefined;
            for (let index = 0, length = boundaries.length - 1; index <= length; index++) {
                let boundary = boundaries[index];

                // We have the first boundary of this chunk
                if (!previousBoundary) {
                    // Push all data into the old field
                    if (this.currentField && boundary.start > 0) {
                        this.currentField.addData(buffer.slice(0, boundary.start - 1));
                    }
                }

                // Push if not the end boundary
                if (!boundary.final) {
                    // Create new Field
                    this.currentField = new Field();
                    this.fields.push(this.currentField);

                    let start = previousBoundary ? previousBoundary.end : 0;

                    // We have the last boundary of this chunk
                    if (index === length) {
                        this.currentField.addData(this.stash(buffer, start));
                    } else {
                        this.currentField.addData(buffer.slice(start, boundary.start - 1));
                    }
                }

                // Store boundary
                previousBoundary = boundary;
            }
        }
    }

    private stash(buffer: Buffer, start: number = 0) {
        let remainderLength = start + buffer.length - this.boundaryLength;
        this.bufferRemainder = buffer.slice(start);
        if (remainderLength > 0) {
            return buffer.slice(start, remainderLength - 1);
        } else {
            return Buffer.alloc(0);
        }
    }

    private unStash(buffer: Buffer) {
        if (this.bufferRemainder.length > 0) {
            return Buffer.concat([this.bufferRemainder, buffer]);
        } else {
            return buffer;
        }
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
}