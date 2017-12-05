export type VerbType = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

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

export var VerbLookup: Verb[] = [Verb.All, Verb.Get, Verb.Post, Verb.Put, Verb.Delete, Verb.Patch, Verb.Options, Verb.Head];