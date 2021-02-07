import { InjectionManager } from "@vue-beans/injections";
import { Ref } from "vue";
import { BeanConstructorInjectable, INJECTOR_IDENTIFIER } from "../src/types";

describe('InjectionManager', () => {
    test('test registerBeanGlobal', () => {
        class Foo {}
        const bean = new Foo()
        const manager = new InjectionManager();
        InjectionManager.registerGlobalBeanFactory('mybean', () => bean)
        const injectedBean = manager.useService('mybean')
        expect(injectedBean.value === bean).toBeTruthy()
        InjectionManager.unRegisterGlobalBeanFactory('mybean')
    })
    test('test registerBean', () => {
        class Foo {}
        const bean = new Foo()
        const manager = new InjectionManager();
        manager.registerBeanFactory('mybean', () => bean)
        const injectedBean = manager.useService('mybean')
        expect(injectedBean.value === bean).toBeTruthy()
    })
    test('test useService with default value', () => {
        class Foo {}
        const bean = new Foo()
        const manager = new InjectionManager();
        const injectedBean = manager.useService('mybean', () => bean)
        expect(injectedBean.value === bean).toBeTruthy();

        const myBeanAgain = manager.useService('mybean')

        expect(myBeanAgain.value === bean).toBeTruthy();

    })

    test('test useService call setup method', () => {
        const setup = jest.fn(() => undefined);

        class Foo {
            setup = setup
        }
        const bean = new Foo()
        const manager = new InjectionManager();
        manager.useService('mybean', () => bean) // first injection
        manager.useService('mybean') // another injection
        expect(setup.mock.calls.length).toEqual(1);

    })
    test('test use useAnonymousService as singleton', () => {
        class Foo {}
        const manager = new InjectionManager();
        const injectedBean = manager.useAnonymousService(Foo)
        expect(injectedBean.value).toBeInstanceOf(Foo);
        const injectedBeanAgain = manager.useAnonymousService(Foo)
        expect(injectedBean.value).toBe(injectedBeanAgain.value)
    })

    test('test use useAnonymousService use createBean', () => {
        class Foo {
            bar: String = "init"
            setup() {
                this.bar = "changed"
            }
        }
        const manager = new InjectionManager();
        const injectedBean = manager.useAnonymousService(Foo)
        expect(injectedBean.value.bar).toBe("changed")

    })

    test('test sharing key between two services', () => {

        class Foo {
            bar: String = "initialBar"
        }
        // Defining name of injector
        (Foo as BeanConstructorInjectable<Foo>)[INJECTOR_IDENTIFIER] = "FooIdentifier"

        class CustomFoo extends Foo {
            bar: String = "customInitialBar"
        }
        const manager = new InjectionManager();
        manager.registerBeanFactory("FooIdentifier", CustomFoo) // overriding every reference to Foo.

        const injectedBean = manager.useAnonymousService(Foo) // referencing to parent foo
        expect(injectedBean.value.bar).toBe("customInitialBar")

    })

    test('test cyclic reference injection', () => {
        const manager = new InjectionManager();

        class Foo {
            bar: Ref<Bar> = manager.useAnonymousService(Bar)
        }
        class Bar {
            foo: Ref<Foo> = manager.useAnonymousService(Foo)
        }

        const fooInstance = manager.useAnonymousService(Foo)

        expect(fooInstance.value === fooInstance.value.bar.value.foo.value).toBeTruthy();

    })
})