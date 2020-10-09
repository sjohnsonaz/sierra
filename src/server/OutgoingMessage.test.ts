import { OutgoingMessage } from "../Sierra";
import { json, raw, send, view } from "./OutgoingMessage";

describe('OutgoingMessage', function () {
    describe('constructor', function () {
        it('should initialize default properties', function () {
            const outgoingMessage = new OutgoingMessage('data');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(200);
            expect(outgoingMessage.type).toBe('auto');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBeUndefined();
        });

        it('should initialize all properties', function () {
            const outgoingMessage = new OutgoingMessage('data', 500, 'json', 'template', 'application/json');;
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(500);
            expect(outgoingMessage.type).toBe('json');
            expect(outgoingMessage.template).toBe('template');
            expect(outgoingMessage.contentType).toBe('application/json');
        });
    });

    describe('send', function () {
        it('should create an OutgoingMessage with defaults', function () {
            const outgoingMessage = send('data');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(200);
            expect(outgoingMessage.type).toBe('auto');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBeUndefined();
        });

        it('should create an OutgoingMessage', function () {
            const outgoingMessage = send('data', 500, 'json', 'template');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(500);
            expect(outgoingMessage.type).toBe('json');
            expect(outgoingMessage.template).toBe('template');
            expect(outgoingMessage.contentType).toBeUndefined();
        });
    });

    describe('view', function () {
        it('should create an OutgoingMessage with defaults', function () {
            const outgoingMessage = view('data');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(200);
            expect(outgoingMessage.type).toBe('view');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBeUndefined();
        });

        it('should create an OutgoingMessage', function () {
            const outgoingMessage = view('data', 'template');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(200);
            expect(outgoingMessage.type).toBe('view');
            expect(outgoingMessage.template).toBe('template');
            expect(outgoingMessage.contentType).toBeUndefined();
        });
    });

    describe('json', function () {
        it('should create an OutgoingMessage with defaults', function () {
            const outgoingMessage = json('data');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(200);
            expect(outgoingMessage.type).toBe('json');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBeUndefined();
        });

        it('should create an OutgoingMessage', function () {
            const outgoingMessage = json('data', 300);
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(300);
            expect(outgoingMessage.type).toBe('json');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBeUndefined();
        });
    });

    describe('raw', function () {
        it('should create an OutgoingMessage with defaults', function () {
            const outgoingMessage = raw('data');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(200);
            expect(outgoingMessage.type).toBe('raw');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBeUndefined();
        });

        it('should create an OutgoingMessage', function () {
            const outgoingMessage = raw('data', 300, 'application/json');
            expect(outgoingMessage.data).toBe('data');
            expect(outgoingMessage.status).toBe(300);
            expect(outgoingMessage.type).toBe('raw');
            expect(outgoingMessage.template).toBeUndefined();
            expect(outgoingMessage.contentType).toBe('application/json');
        });
    });
});