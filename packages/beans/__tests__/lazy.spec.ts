import { createLazyProp, loadLazyFields } from "../src/lazy";

describe('loadLazyFields', () => {
    test('Test that lazy props are replaced', () => {
        const getterFn = jest.fn(() => 10);
        const setterFn = jest.fn((value: number) => {});
        const getterBuilder = jest.fn((name: string, instance: Foo) => getterFn);
        const setterBuilder = jest.fn((name: string, instance: Foo) => setterFn);

        class Foo {
            bar = createLazyProp(getterBuilder, setterBuilder)
        }

        const instance = new Foo()
        loadLazyFields(instance)

        // test builders
        expect(getterBuilder.mock.calls[0][0]).toBe('bar')
        expect(getterBuilder.mock.calls[0][1]).toBe(instance)

        expect(setterBuilder.mock.calls[0][0]).toBe('bar')
        expect(setterBuilder.mock.calls[0][1]).toBe(instance)

        // test setter and getter
        expect(instance.bar).toBe(10)
        expect(getterFn.mock.calls[0].length).toBe(0) // 0 params

        const testValue = 5;
        instance.bar = testValue;

        expect(setterFn.mock.calls[0].length).toBe(1) // 1 param
        expect(setterFn.mock.calls[0][0]).toBe(testValue)

    })
});