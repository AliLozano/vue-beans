import { BeanConstructor, BEFORE_SETUP, addInitializer, createInitializerDecorator } from "../src";

describe('addInitializer', () => {
    test('Test add initializer ', () => {
        class Foo {}
        const fn = () => {}
        const fn2 = () => {}
        addInitializer(Foo, 1000, fn)
        addInitializer(Foo, 1000, fn2)

        const constructor = Foo as BeanConstructor<Foo>
        expect(constructor[BEFORE_SETUP]!![1000][0]).toBe(fn)
        expect(constructor[BEFORE_SETUP]!![1000][1]).toBe(fn2)
    });

    test('Test add initializer with overrideAll ', () => {
        class Foo {}
        const fn = () => {}
        const fn2 = () => {}
        addInitializer(Foo, 1000, fn)
        addInitializer(Foo, 1000, fn2, true)

        const constructor = Foo as BeanConstructor<Foo>
        expect(constructor[BEFORE_SETUP]!![1000][0]).toBe(fn2)
        expect(constructor[BEFORE_SETUP]!![1000].length).toBe(1)
    });
})



describe('createInitializerDecorator', () => {
    test('Test add initializer with decorator ', () => {
        const mockCallback = jest.fn((instance, constructor, attributeName, isStatic) => {});

        const decorator = createInitializerDecorator(mockCallback, 1000)

        class Foo {
            @decorator
            method() {}

            @decorator
            static staticMethod() {}
        }

        const constructor = Foo as BeanConstructor<Foo>
        expect(constructor[BEFORE_SETUP]!![1000].length).toBe(2)
        const instance = new Foo();
        constructor[BEFORE_SETUP]!![1000][0](instance) // call initializer 1
        constructor[BEFORE_SETUP]!![1000][1](instance) // call initializer 2

        expect(mockCallback.mock.calls[0][0]).toBe(instance)
        expect(mockCallback.mock.calls[0][1]).toBe(Foo)
        expect(mockCallback.mock.calls[0][2]).toBe('method')
        expect(mockCallback.mock.calls[0][3]).toBe(false)

        expect(mockCallback.mock.calls[1][0]).toBe(instance)
        expect(mockCallback.mock.calls[1][1]).toBe(Foo)
        expect(mockCallback.mock.calls[1][2]).toBe('staticMethod')
        expect(mockCallback.mock.calls[1][3]).toBe(true)
    });

})