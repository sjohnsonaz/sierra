import { lookupValue } from "../utils/enum";

export enum Verb {
    All = 'all',
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Delete = 'delete',
    Patch = 'patch',
    Options = 'options',
    Head = 'head'
}

export function getVerb(value?: string) {
    return lookupValue(Verb, value, Verb.Get, true);
}
