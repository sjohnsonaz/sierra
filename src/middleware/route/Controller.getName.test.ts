import { Controller } from '../../Sierra';

describe('Controller', function () {
    describe('getName', function () {
        it('should return name for Controllers ending in Service', function () {
            class HomeService extends Controller {
            }
            let base = Controller.getName(new HomeService());
            expect(base).toBe('home');
        });

        it('should return name for Controllers ending in Controller', function () {
            class HomeController extends Controller {
            }
            let base = Controller.getName(new HomeController());
            expect(base).toBe('home');
        });

        it('should return name for Controllers ending in Router', function () {
            class HomeRouter extends Controller {
            }
            let base = Controller.getName(new HomeRouter());
            expect(base).toBe('home');
        });
    });

    describe('getBase', function () {
        it('should return "" for Controllers starting with Home', function () {
            class HomeService extends Controller {
            }
            let base = Controller.getBase(new HomeService());
            expect(base).toBe('');

            class HomeController extends Controller {
            }
            base = Controller.getBase(new HomeController());
            expect(base).toBe('');

            class HomeRouter extends Controller {
            }
            base = Controller.getBase(new HomeRouter());
            expect(base).toBe('');
        });

        it('should return "" for Controllers starting with Index', function () {
            class IndexService extends Controller {
            }
            let base = Controller.getBase(new IndexService());
            expect(base).toBe('');

            class IndexController extends Controller {
            }
            base = Controller.getBase(new IndexController());
            expect(base).toBe('');

            class IndexRouter extends Controller {
            }
            base = Controller.getBase(new IndexRouter());
            expect(base).toBe('');
        });
    });
});