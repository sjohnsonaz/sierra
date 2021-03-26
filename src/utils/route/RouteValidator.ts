abstract class RouteValidator<T extends string | number> {
  type: 'string' | 'number';
  constructor(type: 'string' | 'number') {
    this.type = type;
  }
  abstract run(value: string): T;
}

export class NumberValidator extends RouteValidator<number> {
  constructor() {
    super('number');
  }
  run(value: string) {
    return parseInt(value);
  }
}

export class StringValidator extends RouteValidator<string> {
  constructor() {
    super('string');
  }
  run(value: string) {
    return value;
  }
}

export class Validator<T extends Record<string, RouteValidator<any>>> {
  validators: T;

  constructor(validators: T) {
    this.validators = validators;
  }

  run(...args: any): ValidationResult<T> {
    const result: ValidationResult<T> = {} as any;
    return Object.keys(this.validators).reduce((result, key, index) => {
      const validator = this.validators[key];
      result[key as keyof typeof result] = validator.run(args[index]);
      return result;
    }, result);
  }

  parse = (...args: any) => this.run(...args);
}

type ValidationResult<T extends Record<string, RouteValidator<any>>> = {
  [Property in keyof T]: string;
};
