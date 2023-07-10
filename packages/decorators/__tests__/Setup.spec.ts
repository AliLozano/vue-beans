import { createBean } from '@vue-beans/beans'
import { Setup } from '../src/Setup'

describe('Setup Decorator', () => {
  test('Setup decorator add method to setup function', () => {
    const mockSetup = vitest.fn(() => {})

    class Foo {
      loading: boolean = false
      @Setup()
      load = mockSetup
    }
    const foo = createBean(Foo)
    foo.setup()

    expect(mockSetup.mock.calls.length).toBe(1)
  })
  test('Setup decorator in a parent class should be called', () => {
    const mockSetup = vitest.fn(() => {})

    class FooParent {
      loading: boolean = false
      @Setup()
      load = mockSetup
    }

    class Foo extends FooParent {}
    const foo = createBean(Foo)
    foo.setup()

    expect(mockSetup.mock.calls.length).toBe(1)
  })

  test('Annotate setup function with @Setup should be warn', () => {
    const mockSetup = vitest.fn(() => {})
    const originalConsole = console.warn

    console.warn = vitest.fn()

    class Foo {
      loading: boolean = false
      @Setup()
      setup = mockSetup
    }
    const foo = createBean(Foo)
    foo.setup()

    expect(mockSetup.mock.calls.length).toBe(1)
    expect(console.warn).toBeCalledTimes(1)
    expect(console.warn).lastCalledWith(
      "You shouldn't annotate setup function with @Setup. @Setup will be ignored."
    )

    console.warn = originalConsole
  })
})
