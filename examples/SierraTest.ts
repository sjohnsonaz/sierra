import Sierra, { BodyMiddleware, SessionMiddleware } from '../src/Sierra';

import HandlebarsView from './HandlebarsView';
import HomeController from './HomeController';
import SessionGateway from './SessionGateway';

let testApplication = new Sierra();

// View
HandlebarsView.viewRoot = './examples/views/';
testApplication.view(HandlebarsView.handle);

// Body
testApplication.use(BodyMiddleware.handle);

// Session
let sessionMiddleware = new SessionMiddleware(new SessionGateway());
testApplication.use(sessionMiddleware.handle.bind(sessionMiddleware));

// Controllers
testApplication.addController(new HomeController());

// Init
testApplication.init();

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
    }
    catch (e) {
        console.error(e);
    }
})();