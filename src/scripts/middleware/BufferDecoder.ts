import Field from './Field';
import Boundary from './Boundary';
import { IFileHandler } from './IFileHandler';

export default class BufferDecoder {
    boundary: string;
    //boundaryEnd: string;
    boundaryLength: number;
    bufferRemainder: Buffer;
    bufferRemainderLength
    fields: Field[] = [];
    currentField: Field;
    firstChunk: boolean = true;
    fileHandler: IFileHandler;

    constructor(httpBoundary: string, fileHandler: IFileHandler) {
        this.boundary = '--' + httpBoundary;
        //this.boundaryEnd = httpBoundary + '--';
        // Add two to the end for the '--'
        this.boundaryLength = this.boundary.length + 2;
        this.bufferRemainder = Buffer.alloc(this.boundaryLength);
        this.fileHandler = fileHandler;
    }

    addData(buffer: Buffer) {
        // Get buffer and stash
        buffer = this.unStash(buffer);

        // Get all boundaries from buffer
        let boundaries = Boundary.getBoundaries(buffer, this.boundary);

        // Do we have any boundaries?
        if (!boundaries.length) {
            // We have no boundaries
            // All data goes to the last Field
            if (this.currentField) {
                this.currentField.addData(this.stash(buffer));
            }
        } else {
            // We do have boundaries
            let previousBoundary: Boundary = undefined;
            for (let index = 0, length = boundaries.length - 1; index <= length; index++) {
                let boundary = boundaries[index];

                // Push the data from before the boundary

                // If we have a previous boundary, use it, otherwise start from 0
                let start = previousBoundary ? previousBoundary.end : 0;

                // Push all data into the old field
                if (this.currentField && boundary.start > 0) {
                    this.currentField.addData(buffer.slice(start, boundary.start));
                }

                // Do we have the end boundary?
                if (!boundary.final) {
                    // We do not have the end boundary

                    // Create new Field
                    this.currentField = new Field(this.fileHandler);
                    this.fields.push(this.currentField);

                    // Do we have the last boundary of this chunk?
                    if (index === length) {
                        // We have the last boundary of this
                        this.currentField.addData(this.stash(buffer, boundary.end));
                    }
                }

                // Store boundary
                previousBoundary = boundary;
            }
        }
    }

    private stash(buffer: Buffer, start: number = 0) {
        let remainderLength = start + buffer.length - this.boundaryLength;
        this.bufferRemainder = buffer.slice(remainderLength);
        if (remainderLength > 0) {
            return buffer.slice(start, remainderLength);
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