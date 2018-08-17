///<reference path="../interface.d.ts"/>


import { get, hashBy, set } from '../utils';


export default (options: ICreateOptions) => {

    const classesHash = hashBy<IClassData>('name', options.classes);

    return (data: string): object => {
        const objectForParse: _IResulStringify = options.jsonParse ? options.jsonParse(data) : JSON.parse(data);

        const content = objectForParse.content;

        objectForParse.meta.forEach(item => {

            const classData = classesHash[item.name];

            if (classData.parse) {
                const forSet = classData.parse(get(item.path, content));
                set(item.path, forSet, content);
            }
        });

        return content;
    };
};
