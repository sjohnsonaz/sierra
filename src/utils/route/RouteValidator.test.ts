import { createRoute } from './Route';
import { createValidator } from './RouteValidator';

describe('createValidator', function () {
  it('should parse results', function () {
    const validator = createValidator({
      id: Number,
      name: String,
    });
    const result = validator('1', 'test');
    expect(result).toStrictEqual({
      id: 1,
      name: 'test',
    });
  });

  it('should run inside Routes', function () {
    const route = createRoute(
      (id, name) => `base/${id}/${name}`,
      createValidator({
        id: Number,
        name: String,
      })
    );
    const result = route.match('base/1/name');
    if (result) {
      const { id, name } = result;
    }
    expect(result).toStrictEqual({
      id: 1,
      name: 'name',
    });
  });

  it('should handle route trip', function () {
    const route = createRoute(
      (id, name) => `base/${id}/${name}`,
      createValidator({
        id: Number,
        name: String,
      })
    );

    const data = {
      id: 1,
      name: 'name',
    };

    const { id, name } = data;

    const url = route.run(id, name);
    const match = route.match(url);

    expect(match).toStrictEqual(data);
  });
});
