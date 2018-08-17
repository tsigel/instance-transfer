///<reference path="../interface.d.ts"/>


import { getContainerLike, getFindConstructorFactory, hashBy } from '../utils';


export default (options: ICreateOptions) => {

    const classesHash = hashBy<IClassData>('name', options.classes);
    const findConstructor = getFindConstructorFactory(classesHash);

    return (data: object | Array<object>): string => {

        const result = {
            meta: [],
            content: getContainerLike(data)
        };

        const loop = (data, parent, path) => {
            Object.keys(data).forEach(name => {
                const item = data[name];
                const dot = path ? '.' : '';
                const localPath = `${path}${dot}${name}`;

                switch (typeof item) {
                    case 'object':
                        if (!item) {
                            parent[name] = item;
                            break;
                        }

                        const classInfo = findConstructor(item.constructor);

                        if (classInfo && classInfo.stringify) {
                            result.meta.push({
                                path: localPath,
                                name: classInfo.name
                            });
                            parent[name] = classInfo.stringify(item);
                            break;
                        }

                        if (item.toJSON) {
                            parent[name] = item.toJSON();
                            break;
                        }

                        parent[name] = getContainerLike(item);

                        loop(item, parent[name], localPath);

                        break;
                    default:
                        parent[name] = item;
                }
            });
        };

        loop(data, result.content, '');

        if (options.jsonStringify) {
            return options.jsonStringify(result);
        } else {
            return JSON.stringify(result);
        }
    };
};
