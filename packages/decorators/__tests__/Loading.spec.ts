import { createBean } from '@vue-beans/beans'
import { Setup, Loading } from '../src'

describe('Loading Decorator', () => {
  test('Loading decorator changes the variable loading', () => {
    class Foo {
      loading: boolean = false
      @Loading('loading')
      asyncFunction(): Promise<void> {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
      }
    }
    const foo = createBean(Foo)
    foo.setup()
    const promise = foo.asyncFunction()
    expect(foo.loading).toBeTruthy() // before de async function ends

    return promise.then(() => expect(foo.loading).toBeFalsy())
  })

  test('Loading decorator skip function when it is already loading', () => {
    const fn = vitest.fn(() => 10)
    class Foo {
      loading: boolean = true
      @Loading('loading')
      functionWithLoading = fn
    }
    const foo = createBean(Foo)
    foo.setup()
    foo.loading = true // it is already running
    foo.functionWithLoading()
    expect(fn.mock.calls.length).toBe(0)
  })

  test('Loading decorator works with @Setup decorator', () => {
    class Foo {
      loading: boolean = false
      promise: Promise<void> | null = null
      @Setup()
      @Loading('loading')
      asyncFunction(): Promise<void> {
        this.promise = new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
        return this.promise
      }
    }
    const foo = createBean(Foo)
    foo.setup()

    expect(foo.promise == null).toBeFalsy() // method was called
    expect(foo.loading).toBeTruthy() // before de async function ends

    return foo.promise!.then(() => expect(foo.loading).toBeFalsy())
  })
})
