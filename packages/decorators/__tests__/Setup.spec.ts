import { createBean } from "@vue-beans/beans";
import { Setup } from "../src/Setup";

describe('Setup Decorator', () => {
    test('Setup decorator add method to setup function', () => {
        const mockSetup = jest.fn(() => {});

        class Foo {
            loading: boolean = false;
            @Setup()
            load = mockSetup
        }
        const foo = createBean(Foo)
        foo.setup()

        expect(mockSetup.mock.calls.length).toBe(1)
    })
})