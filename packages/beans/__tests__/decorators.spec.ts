import { remapFunctionsToClosures } from '../src/builders'
import { Reactive } from '../src'
import { BeanConstructor, IS_REACTIVE } from '../src/types'

describe('remapFunctionsToClosures', () => {
  test('Test that functions of objects are converted to closures', () => {
    class Foo {
      name = 'Ali'

      greet(): string {
        return `Hello ${this.name}`
      }
    }

    const { greet, name } = remapFunctionsToClosures(new Foo())
    expect(greet()).toBe(`Hello ${name}`) // method is a closure now.
  })
})

describe('Reactive', () => {
  test('Test that @Reactive() mark a class as reactive', () => {
    @Reactive()
    class Foo {}
    expect((Foo as BeanConstructor<Foo>)[IS_REACTIVE]).toBe(true) // method is a closure now.
  })
  test('Test that @Reactive works without parenthetis', () => {
    @Reactive
    class Foo {}
    expect((Foo as BeanConstructor<Foo>)[IS_REACTIVE]).toBe(true) // method is a closure now.
  })
})
