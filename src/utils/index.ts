///<reference path="../interface.d.ts"/>


export const hashBy = <T>(prop: string, list: Array<object>): IHash<T> => {

    const hash = Object.create(null);
    list.forEach(item => {

        const id = item[prop];
        if (id == null) {
            throw new Error(`Has no id for group ${prop}!`);

        }
        if (hash[id]) {
            throw new Error(`Duplicate id ${id}!`);

        }
        hash[id] = item;

    });
    return hash;

};

export const getFindConstructorFactory = (hash: IHash<IClassData>) => constructor => {
    const name = getClassName(constructor);
    return hash[name] || null;
};

export const getClassName = (fn): string => {
    const s = ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
    return (s && s[1] || 'anonymous');
};

export const getContainerLike = origin => Array.isArray(origin) ? [] : Object.create(null);

export function get(path: string, data: object | Array<object>): any {
    const parts = path.split('.');
    let tmp = data;

    parts.forEach(pathPart => {
        tmp = tmp && tmp[pathPart] || null;
    });

    return tmp;
}

export function set(path: string, value: any, data: object | Array<object>): void {
    const pathParts = path.split('.');

    let parentPath;
    let name;
    let parent;

    if (pathParts.length > 1) {
        parentPath = path.split('.').slice(0, -1).join('.');
        name = path.replace(`${parentPath}.`, '');
        parent = get(parentPath, data);
    } else {
        name = path;
        parent = data;
    }

    if (parent == null) {
        throw new Error(`Can't set data with path ${path}!`);
    }

    parent[name] = value;
}
