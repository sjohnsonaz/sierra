import { stringToRegex } from '../RouteUtil';
import { createRoute, Route, defaultParseFunction } from './Route';

describe('Route', function () {
  describe('constructor', function () {
    const routeFunction = (id: string | number, name: string | number) =>
      `/test/${id}/${name}`;
    const route = new Route(routeFunction, defaultParseFunction);

    it('should set route', function () {
      expect(route.route).toBe(routeFunction);
    });

    it('should set names', function () {
      expect(route.names).toStrictEqual(['id', 'name']);
    });

    it('should set definition', function () {
      expect(route.definition).toBe('/test/:id/:name');
    });

    it('should set regExp', function () {
      expect(route.regExp).toStrictEqual(stringToRegex('/test/:id/:name'));
    });

    it('should set parser', function () {
      expect(route.parser).toBe(defaultParseFunction);
    });
  });

  describe('run', function () {});

  describe('match', function () {
    describe('defaultParseFunction', function () {
      const route = new Route(
        (id, name) => `/test/${id}/${name}`,
        defaultParseFunction
      );

      it('should create route strings', function () {
        const result = route.run(1, 'value');
        expect(result).toBe('/test/1/value');
      });

      it('should match route strings', function () {
        const result = route.match('/test/1/value');
        expect(result).toStrictEqual(['1', 'value']);
      });
    });

    describe('custom parser', function () {
      const route = createRoute(
        (id, name) => `/test/${id}/${name}`,
        (id, name) => ({ id, name })
      );
      it('should create route strings', function () {
        const result = route.run(1, 'value');
        expect(result).toBe('/test/1/value');
      });

      it('should create match objects', function () {
        const result = route.match('/test/1/value');
        expect(result).toStrictEqual({
          id: '1',
          name: 'value',
        });
      });
    });
  });
});
