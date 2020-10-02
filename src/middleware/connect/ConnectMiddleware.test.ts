import * as request from 'supertest';

import Sierra from '../../Sierra';
import { ConnectMiddleware } from './ConnectMiddleware';

describe('ConnectMiddleware', () => {
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
    });

    it('should continue on next()', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            next();
        }));

        await request(application.createServer())
            .get('')
            .expect(200, JSON.stringify('returned'));
    });

    it('should throw on next(err)', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            next('throw error');
        }));

        await request(application.createServer())
            .get('')
            .expect(500, JSON.stringify('errored'));
    });

    it('should continue on send()', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            res.write(JSON.stringify('returned'));
            res.end();
        }));

        await request(application.createServer())
            .get('')
            .expect(200, JSON.stringify('returned'));
    });
});