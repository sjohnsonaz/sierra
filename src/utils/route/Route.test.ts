import { Route } from './Route';
describe('Route', function () {
  const route = new Route((id, name) => `/test/${id}/${name}`);

  it('should create route strings', function () {
    const result = route.run(1, 'value');
    expect(result).toBe('/test/1/value');
  });

  it('should match route strings', function () {
    const result = route.match('/test/1/value');
    expect(result).toStrictEqual(['1', 'value']);
  });

  it('should create match objects', function () {
    const result = route.matchObject('/test/1/value');
    expect(result).toStrictEqual({
      id: '1',
      name: 'value',
    });
  });
});
