import fetch from 'node-fetch';

import Sierra from '../../Sierra';
import { ConnectMiddleware } from './ConnectMiddleware';

describe('ConnectMiddleware', () => {
    const port = 3001;
    const url = `http://localhost:${port}`;
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

        const response = await fetch(`${url}`);
        const result = await response.json();
        expect(result).toBe('returned');
    });

    it('should throw on next(err)', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            next('throw error');
        }));

        const response = await fetch(`${url}`);
        const result = await response.json();
        expect(result).toBe('errored');
    });

    it('should continue on send()', async () => {
        application.use(ConnectMiddleware((req, res, next) => {
            res.write(JSON.stringify('returned'));
            res.end();
        }));

        const response = await fetch(`${url}`);
        const result = await response.json();
        expect(result).toBe('returned');
    });
});