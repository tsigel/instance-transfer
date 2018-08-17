///<reference path="interface.d.ts"/>

import parseFactory from './parse';
import stringifyFactory from './stringify';
import { hashBy, getClassName as getClassNameUtils } from './utils';


export function create(options: ICreateOptions) {

    try {
        hashBy<IClassData>('name', options.classes);
    } catch (e) {
        const message = e.message;

        if (message.includes('Has no id for group')) {
            throw new Error(''); // TODO Write error message for user!
        }

        if (message.includes('Duplicate id')) {
            throw new Error(''); // TODO Write error message for user!
        }
    }

    const parse = parseFactory(options);
    const stringify = stringifyFactory(options);

    return { parse, stringify };
}

export function getClassName(classConstructor: Function) {
    return getClassNameUtils(classConstructor);
}

export default create;
