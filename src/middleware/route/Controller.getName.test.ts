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
});