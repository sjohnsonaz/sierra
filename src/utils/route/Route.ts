import { stringToRegex } from '../RouteUtil';

interface RouteFunction {
  (...args: (string | number)[]): string;
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

export function getParameterNames<T extends () => any>(
  functionHandle: T
): string[] {
  let definition = functionHandle.toString().replace(STRIP_COMMENTS, '');
  if (definition.startsWith('function')) {
    // We have a standard function
    return (
      definition
        .slice(definition.indexOf('(') + 1, definition.indexOf(')'))
        .match(/([^\s,]+)/g) || []
    );
  } else {
    // We have an arrow function
    let arrowIndex = definition.indexOf('=>');
    let parenthesisIndex = definition.indexOf('(');
    if (parenthesisIndex > -1 && parenthesisIndex < arrowIndex) {
      return (
        definition
          .slice(parenthesisIndex + 1, definition.indexOf(')'))
          .match(/([^\s,]+)/g) || []
      );
    } else {
      return definition.slice(0, arrowIndex).match(/([^\s,]+)/g) || [];
    }
  }
}

export class Route<T extends RouteFunction> {
  readonly route: T;
  readonly names: string[];
  readonly definition: string;
  readonly regExp: RegExp;

  constructor(route: T) {
    this.route = route;
    this.names = getParameterNames(route);
    this.definition = route(...this.names.map((name) => `:${name}`));
    this.regExp = stringToRegex(this.definition);
  }

  run(...args: Parameters<T>) {
    return this.route(...args);
  }

  match(pathname: string) {
    const matches = pathname.match(this.regExp);
    if (matches) {
      return matches.splice(1);
    } else {
      return undefined;
    }
  }

  matchObject(pathname: string) {
    const matches = pathname.match(this.regExp);
    if (matches) {
      const values = matches.splice(1);
      const { names } = this;
      const output: Record<string, string> = {};
      values.reduce((output, value, index) => {
        const name = names[index];
        output[name] = value;
        return output;
      }, output);
      return output;
    } else {
      return undefined;
    }
  }

  toString() {
    return this.definition;
  }

  toRegExp() {
    return this.regExp;
  }
}
