import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import Sierra from '../../Sierra';
import { ConnectMiddleware } from './ConnectMiddleware';

describe('ConnectMiddleware', () => {
    const port = 3001;
    let application: Sierra;

    beforeEach(async () => {
        application = new Sierra();
        application.use(async () => {
            return 'returned';
        });
        application.error(async () => {
            return 'errored';
        });
        application.init();
        await application.listen(port);
    });

    afterEach(async () => {
        await application.close();
    });

    it('should continue on next()', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            next();
        }));

        let res = await chai.request('localhost:' + port).get('');
        expect(res).to.be.string;
        let result = JSON.parse(res.text);
        expect(result).to.equal('returned');
    });

    it('should throw on next(err)', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            next('throw error');
        }));

        let res = await chai.request('localhost:' + port).get('');
        expect(res).to.be.string;
        let result = JSON.parse(res.text);
        expect(result).to.equal('errored');
    });

    it('should continue on send()', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            res.write('returned');
            res.end();
        }));

        try {
            let res = await chai.request('localhost:' + port).get('');
            expect(res).to.be.string;
            let result = JSON.parse(res.text);
            expect(result).to.equal('returned');
        }
        catch (e) {
            console.error(e);
        }
    });
});