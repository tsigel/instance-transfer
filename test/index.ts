import create from '../src/index';


class Person {
    public name: string;
    public age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class MyTestToJSON {

    public name: string;

    constructor(name) {
        this.name = name;
    }

    public toJSON(): string {
        return `name-${this.name}`;
    }
}


describe('instance-transfer', () => {

    describe('stringify', () => {

        let stringify;
        beforeEach(() => {
            stringify = create({
                classes: [
                    {
                        name: 'Person',
                        stringify: (item) => `${item.name}|${item.age}`
                    }
                ]
            }).stringify;
        });

        it('without classes', () => {
            const data = {
                a: 1,
                b: '1',
                c: true,
                e: null,
                s: undefined
            };

            expect(stringify(data)).toBe('{"meta":[],"content":{"a":1,"b":"1","c":true,"e":null}}');
        });

        it('without classes and with deep objects', () => {
            const data = {
                a: 1,
                b: {
                    c: 1,
                    d: {
                        e: false
                    }
                }
            };

            expect(stringify(data)).toBe('{"meta":[],"content":{"a":1,"b":{"c":1,"d":{"e":false}}}}');
        });

        it('with method toJSON', () => {

            const data = {
                a: 1,
                b: { toJSON: () => ({ b: 2 }) },
                c: new MyTestToJSON('test')
            };

            expect(stringify(data)).toBe('{"meta":[],"content":{"a":1,"b":{"b":2},"c":"name-test"}}');
        });

        it('with custom stringify', () => {

            const data = {
                a: 1,
                b: new Person('Vasia', 18),
                c: {
                    d: new Person('Petia', 20)
                }
            };

            expect(stringify(data)).toBe('{"meta":[{"path":"b","name":"Person"},{"path":"c.d","name":"Person"}],"content":{"a":1,"b":"Vasia|18","c":{"d":"Petia|20"}}}');
        });

        it('with custom stringify function', () => {
            const stringify = create({
                jsonStringify: data => data,
                classes: []
            }).stringify;

            expect(stringify({ b: 1 })).toEqual({ meta: [], content: { b: 1 } });
        });

    });

    describe('parse', () => {

        let parse;
        beforeEach(() => {
            parse = create({
                classes: [
                    {
                        name: 'Person',
                        parse: (item) => {
                            const [name, age] = item.split('|');
                            return new Person(name, Number(age));
                        }
                    }
                ]
            }).parse;
        });

        it('parse simple data', () => {

            expect(parse('{"meta":[],"content":{"a":1,"b":"1","c":true,"e":null}}')).toMatchObject({
                a: 1,
                b: '1',
                c: true,
                e: null
            });

        });

        it('parse data with deep objects', () => {

            expect(parse('{"meta":[],"content":{"a":1,"b":{"c":1,"d":{"e":false}}}}')).toMatchObject({
                a: 1,
                b: {
                    c: 1,
                    d: {
                        e: false
                    }
                }
            });

        });

        it('parse with custom stringify', () => {

            expect(parse('{"meta":[{"path":"b","name":"Person"},{"path":"c.d","name":"Person"}],"content":{"a":1,"b":"Vasia|18","c":{"d":"Petia|20"}}}')).toMatchObject({
                a: 1,
                b: new Person('Vasia', 18),
                c: {
                    d: new Person('Petia', 20)
                }
            });
        });

        it('with custom json parse', () => {
            let wasCall = false;

            const parse = create({
                classes: [],
                jsonParse: (data) => {
                    wasCall = true;
                    return JSON.parse(data);
                }
            }).parse;

            expect(parse('{"meta":[],"content":{"a":1,"b":"1","c":true,"e":null}}')).toMatchObject({
                a: 1,
                b: '1',
                c: true,
                e: null
            });
            expect(wasCall).toBe(true);

        });

    });
});
