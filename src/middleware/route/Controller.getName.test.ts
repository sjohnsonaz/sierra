import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import { Controller } from '../../Sierra';

describe('RouteUtil.getControllerName()', () => {
    it('should return name for Controllers ending in Service', () => {
        class TestService extends Controller {
        }
        let base = Controller.getName(new TestService());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in Controller', () => {
        class TestController extends Controller {
        }
        let base = Controller.getName(new TestController());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in Router', () => {
        class TestRouter extends Controller {
        }
        let base = Controller.getName(new TestRouter());
        expect(base).to.equal('test');
    });

    it('should return "" for Controllers starting with Home', () => {
        class HomeService extends Controller {
        }
        let base = Controller.getName(new HomeService());
        expect(base).to.equal('');

        class HomeController extends Controller {
        }
        base = Controller.getName(new HomeController());
        expect(base).to.equal('');

        class HomeRouter extends Controller {
        }
        base = Controller.getName(new HomeRouter());
        expect(base).to.equal('');
    });

    it('should return "" for Controllers starting with Index', () => {
        class IndexService extends Controller {
        }
        let base = Controller.getName(new IndexService());
        expect(base).to.equal('');

        class IndexController extends Controller {
        }
        base = Controller.getName(new IndexController());
        expect(base).to.equal('');

        class IndexRouter extends Controller {
        }
        base = Controller.getName(new IndexRouter());
        expect(base).to.equal('');
    });
});