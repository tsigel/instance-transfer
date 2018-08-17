interface ICreateOptions {
    jsonParse?: (data: string) => object;
    jsonStringify?: (data: any) => string;
    classes: Array<IClassData>
}

interface IClassData {
    name: string;
    stringify?: (instance: any) => any;
    parse?: (content: any) => any;
}

interface IHash<T> {
    [key: string]: T;
}

interface _IMetaItem {
    name: string;
    path: string;
}

interface _IResulStringify {
    meta: Array<_IMetaItem>;
    content: object | Array<object>;
}
