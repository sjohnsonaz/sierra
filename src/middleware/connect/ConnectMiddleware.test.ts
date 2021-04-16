import * as request from 'supertest';

import { Application } from '../../Application';

import { ConnectMiddleware } from './ConnectMiddleware';

describe('ConnectMiddleware', () => {
    let application: Application;

    beforeEach(async () => {
        // TODO: Use Fake Timers
        jest.useFakeTimers();
        application = new Application();
        application.use(async () => {
            return 'returned';
        });
        application.useError(async () => {
            return 'errored';
        });
        application.init();
    });

    it('should continue on next()', async () => {
        application.use(
            ConnectMiddleware((_req, _res, next) => {
                next();
            })
        );

        await request(application.server).get('').expect(200, JSON.stringify('returned'));
    });

    it('should throw on next(err)', async () => {
        application.use(
            ConnectMiddleware((_req, _res, next) => {
                next('throw error');
            })
        );
        jest.advanceTimersByTime(1000);

        await request(application.server).get('').expect(500, JSON.stringify('errored'));
    });

    // TODO: Confirm this calls interval
    it('should end on send()', async () => {
        application.use(
            ConnectMiddleware((_req, res) => {
                res.write(JSON.stringify('returned'));
                res.end();
            })
        );
        application.use(async () => {});

        await request(application.server).get('').expect(200, JSON.stringify('returned'));
    });

    it('should end on done()', async () => {
        application.use(
            ConnectMiddleware((_req, res, _next, done) => {
                res.write(JSON.stringify('returned'));
                res.end();
                done();
            })
        );

        await request(application.server).get('').expect(200, JSON.stringify('returned'));
    });
});
