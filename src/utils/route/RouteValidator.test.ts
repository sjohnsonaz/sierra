import { createRoute } from './Route';
import { Validator, NumberValidator, StringValidator } from './RouteValidator';

describe('RouteValidator', function () {
  it('should parse results', function () {
    const validator = new Validator({
      id: new NumberValidator(),
      name: new StringValidator(),
    });
    const result = validator.run('1', 'test');
    expect(result).toStrictEqual({
      id: 1,
      name: 'test',
    });
  });

  it('should run inside Routes', function () {
    const route = createRoute(
      (id, name) => `base/${id}/${name}`,
      new Validator({
        id: new NumberValidator(),
        name: new StringValidator(),
      }).parse
    );
    const result = route.match('base/1/name');
    expect(result).toStrictEqual({
      id: 1,
      name: 'name',
    });
  });
});
