import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import { Controller } from '../../Sierra';

describe('Controller', function () {
    describe('getName', function () {
        it('should return name for Controllers ending in Service', function () {
            class HomeService extends Controller {
            }
            let base = Controller.getName(new HomeService());
            expect(base).to.equal('home');
        });

        it('should return name for Controllers ending in Controller', function () {
            class HomeController extends Controller {
            }
            let base = Controller.getName(new HomeController());
            expect(base).to.equal('home');
        });

        it('should return name for Controllers ending in Router', function () {
            class HomeRouter extends Controller {
            }
            let base = Controller.getName(new HomeRouter());
            expect(base).to.equal('home');
        });
    });

    describe('getBase', function () {
        it('should return "" for Controllers starting with Home', function () {
            class HomeService extends Controller {
            }
            let base = Controller.getBase(new HomeService());
            expect(base).to.equal('');

            class HomeController extends Controller {
            }
            base = Controller.getBase(new HomeController());
            expect(base).to.equal('');

            class HomeRouter extends Controller {
            }
            base = Controller.getBase(new HomeRouter());
            expect(base).to.equal('');
        });

        it('should return "" for Controllers starting with Index', function () {
            class IndexService extends Controller {
            }
            let base = Controller.getBase(new IndexService());
            expect(base).to.equal('');

            class IndexController extends Controller {
            }
            base = Controller.getBase(new IndexController());
            expect(base).to.equal('');

            class IndexRouter extends Controller {
            }
            base = Controller.getBase(new IndexRouter());
            expect(base).to.equal('');
        });
    });
});