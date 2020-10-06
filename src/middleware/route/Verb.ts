export type Verb =
    'all' |
    'get' |
    'post' |
    'put' |
    'delete' |
    'patch' |
    'options' |
    'head';

const VerbType = createEnum<Verb>({
    All: 'all',
    Get: 'get',
    Post: 'post',
    Put: 'put',
    Delete: 'delete',
    Patch: 'patch',
    Options: 'options',
    Head: 'head'
});

function createEnum<T>(value: Record<string, T>) {
    return Object.freeze(value);
}

export const VerbLookup = Object.freeze([
    VerbType.All,
    VerbType.Get,
    VerbType.Post,
    VerbType.Put,
    VerbType.Delete,
    VerbType.Patch,
    VerbType.Options,
    VerbType.Head
]);
