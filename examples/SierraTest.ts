import Sierra, { BodyMiddleware, LogLevel, QueryStringMiddleware, SessionMiddleware } from '../src';

import HandlebarsView from './HandlebarsView';
import HomeController from './HomeController';
import SessionGateway from './SessionGateway';

let testApplication = new Sierra()

    // Body
    .use(QueryStringMiddleware)
    .use(BodyMiddleware)

    // Session
    .use(new SessionMiddleware(new SessionGateway()).handle);

// Controllers
testApplication.addController(new HomeController());

// View
HandlebarsView.viewRoot = './examples/views/';
testApplication.useView(HandlebarsView.handle);

// Init
testApplication.init();
testApplication.logging = LogLevel.verbose;

// Listen
const port = 3001;
(async () => {
    try {
        await testApplication.listen(port);
        console.log('Listening to port: ' + port);

        await testApplication.wait();
        console.log('Stopping...');

        await testApplication.close();
        console.log('Stopped');
    } catch (e) {
        console.error(e);
    }
})();
