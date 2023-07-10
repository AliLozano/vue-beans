import {
  createBean,
  createInitializerDecorator,
  createLazyProp,
  Reactive
} from '../src'
import { isReactive, ref } from 'vue'

describe('createBean', () => {
  test('Test create basic bean ', () => {
    class Foo {}
    const foo = createBean(Foo)
    expect(foo).toBeInstanceOf(Foo)
  })
  test('Test create basic reactive bean ', () => {
    @Reactive
    class Foo {}
    const foo = createBean(Foo)
    expect(isReactive(foo)).toBeTruthy()
  })
  test('Test create bean converts functions to closure functions ', () => {
    @Reactive
    class Foo {
      bar = ref('value')
      fn() {
        return this.bar.value
      }
    }
    const { fn } = createBean(Foo)
    expect(fn()).toBe('value')
  })
  test('Test create bean loads lazy props ', () => {
    class Foo {
      bar = createLazyProp(() => () => 'Fuuuuu')
    }
    const foo = createBean(Foo)
    expect(foo.bar).toBe('Fuuuuu')
  })
  test('Test create bean doesnt call setup ', () => {
    const uppercase = createInitializerDecorator(
      (instance, constructor, attributeName) => {
        instance[attributeName] = (
          instance[attributeName] as string
        ).toUpperCase()
      }
    )
    class Foo {
      @uppercase
      bar = 'lowercase'
    }
    const foo = createBean(Foo)
    expect(foo.bar).toBe('lowercase')
  })
  test('Test create bean create setup method with initializers ', () => {
    const uppercase = createInitializerDecorator(
      (instance, constructor, attributeName) => {
        instance[attributeName] = (
          instance[attributeName] as string
        ).toUpperCase()
      }
    )
    class Foo {
      @uppercase
      bar = 'lowercase'
    }
    const foo = createBean(Foo)
    foo.setup()
    expect(foo.bar).toBe('LOWERCASE')
  })
})
