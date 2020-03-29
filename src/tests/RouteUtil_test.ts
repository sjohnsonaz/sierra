import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import { Controller } from '../scripts/Sierra';

describe('RouteUtil.getControllerName()', () => {
    it('should return name for Controllers ending in Controller', () => {
        class TestService extends Controller {
        }
        let base = Controller.getName(new TestService());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in controller', () => {
        class Testservice extends Controller {
        }
        let base = Controller.getName(new Testservice());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in Service', () => {
        class TestController extends Controller {
        }
        let base = Controller.getName(new TestController());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in service', () => {
        class Testcontroller extends Controller {
        }
        let base = Controller.getName(new Testcontroller());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in Router', () => {
        class TestRouter extends Controller {
        }
        let base = Controller.getName(new TestRouter());
        expect(base).to.equal('test');
    });

    it('should return name for Controllers ending in router', () => {
        class Testrouter extends Controller {
        }
        let base = Controller.getName(new Testrouter());
        expect(base).to.equal('test');
    });
});