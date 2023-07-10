import { createComponent } from '../src'
import { Setup } from '@vue-beans/decorators'

describe('components', () => {
  test('createComponent from class', () => {
    class Foo {}
    const component = createComponent(Foo)
    expect(component.name).toBe('Foo')
  })

  test('Decorator in parents works in components', () => {
    const mockSetup = vitest.fn(() => {})

    class FooParent {
      loading: boolean = false
      @Setup()
      load = mockSetup
    }

    class Foo extends FooParent {}
    const foo = createComponent(Foo)
    foo.setup()

    expect(mockSetup.mock.calls.length).toBe(1)
  })
})
