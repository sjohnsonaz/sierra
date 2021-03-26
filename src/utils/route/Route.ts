import { stringToRegex, getParameterNames } from '../RouteUtil';

interface RouteFunction {
  (...args: (string | number)[]): string;
}

type MatchArray<T> = {
  [Property in keyof T]?: string;
};

type MatchParameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? MatchArray<P>
  : never;

interface ParseFunction<T extends RouteFunction, U> {
  (...args: MatchParameters<T>): U;
}

export class Route<T extends RouteFunction, U extends ParseFunction<T, any>> {
  readonly route: T;
  readonly names: string[];
  readonly definition: string;
  readonly regExp: RegExp;
  readonly parser: U;

  constructor(route: T, parser: U) {
    this.route = route;
    this.names = getParameterNames(route);
    this.definition = route(...this.names.map((name) => `:${name}`));
    this.regExp = stringToRegex(this.definition);
    this.parser = parser;
  }

  run(...args: Parameters<T>) {
    return this.route(...args);
  }

  match(pathname: string): ReturnType<U> | undefined {
    const matches = pathname.match(this.regExp);
    if (matches) {
      return this.parser(...(matches.splice(1) as any));
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

export function createRoute<T extends RouteFunction>(
  route: T
): Route<T, (...args: MatchParameters<T>) => MatchParameters<T>>;
export function createRoute<
  T extends RouteFunction,
  U extends ParseFunction<T, any>
>(route: T, parser: U): Route<T, U>;
export function createRoute(route: any, parser: any = defaultParseFunction) {
  return new Route(route, parser);
}

export function defaultParseFunction<T extends RouteFunction>(
  ...args: MatchParameters<T>
) {
  return [...args];
}
