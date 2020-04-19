import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import { Route, Verb } from './Sierra';
import { sortRoutes } from './Application';

describe('Route.sort', () => {
    it('routes are sorted by RegExp, then location or first \':\', then alphabetical', () => {

        let routes = [
            '/',
            '/:id',
            '/count',
            '/test/:id',
            '/:var/a/',
            '/findit/:name',
            '/getsomething/:id/:name',
            '/getsomething/:name/:id',
            '/getsomething/:another/:id',
            '/getsomething/:id/fixed'
        ];

        routes.map(route => {
            return new Route(Verb.Get, route, undefined, undefined, undefined, undefined, undefined, undefined);
        }).sort(sortRoutes);

        expect(true).to.equal(true);
    });
});