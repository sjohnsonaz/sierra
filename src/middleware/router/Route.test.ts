import { Context, Verb } from "../../server";
import { Route } from "./Route";

describe('Route', function () {
    describe('constructor', function () {
        it('should initialize properties', function () {
            const method = async function test(context: Context) { }
            const route = new Route(Verb.Get, 'test', method, 'template');
            expect(route.verbs).toStrictEqual([Verb.Get]);
            expect(route.name).toBe('test');
            expect(route.regex).toStrictEqual(/^\/test$/i);
            expect(route.method).toBe(method);
            expect(route.template).toBe('template');
            expect(route.parameters).toStrictEqual([]);
        });

        it('should hadle parameterized routes', function () {
            const method = async function test(context: Context) { }
            const route = new Route(Verb.Get, 'test/:id', method, 'template');
            expect(route.verbs).toStrictEqual([Verb.Get]);
            expect(route.name).toBe('test/:id');
            expect(route.regex).toStrictEqual(/^\/test\/([^/]*)$/i);
            expect(route.method).toBe(method);
            expect(route.template).toBe('template');
            expect(route.parameters).toStrictEqual(['id']);

        })
    });
});
