import * as Crypto from 'crypto';

import Context from '../server/Context';
import { ICookie } from '../server/ICookie';

export default class Session {
    static async handle(context: Context) {
        let cookie = context.request.headers.cookie;
        let cookies = Session.cookieToHash(cookie);
        if (!cookies['sierra_id']) {
            cookies['sierra_id'] = Session.uuid();
        }
        context.response.setHeader('Set-Cookie', Session.hashToCookie(cookies));
    }

    static cookieToHash(cookie: string) {
        let entries = cookie ? cookie.split(';').map(entry => entry.trim()) : [];
        let hash: ICookie = {};
        entries.forEach(entry => {
            let parts = entry.split('=');
            if (parts.length === 2 && parts[0] && parts[1]) {
                hash[parts[0]] = parts[1];
            }
        });
        return hash;
    }

    static hashToCookie(hash: ICookie) {
        return Object.keys(hash).map(name => name + '=' + hash[name] + ';').join(' ');
    }

    static uuid() {
        var rnds = Crypto.randomBytes(16);

        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;

        return bytesToUuid(rnds);
    }
}

var byteToHex: string[] = [];
for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf: Buffer, offset?: number) {
    var i = offset || 0;
    var bth = byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]];
}