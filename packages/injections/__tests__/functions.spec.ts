import {
  InjectionManager,
  injectRef,
  setCurrentInjectionManager,
  useService
} from '../src/index'
import { ref } from 'vue'
import { createBean } from '@vue-beans/beans'

describe('useService', () => {
  test('test useService uses useAnonymousService', () => {
    class Foo {}

    const manager = new InjectionManager()

    const bean = new Foo()

    const useAnonymousService = vitest.fn((builder: new () => Foo) => bean)

    manager.useAnonymousService = useAnonymousService as any

    setCurrentInjectionManager(manager)

    const service = useService(Foo)

    expect(useAnonymousService.mock.calls.length).toBe(1)
    expect(useAnonymousService.mock.calls[0][0]).toBe(Foo)
    expect(service).toBe(bean)

    setCurrentInjectionManager(null)
  })
})

describe('injectRef', () => {
  test('injectRef unwrap references', () => {
    const childReference = ref({ name: 'child' })
    const reference = ref({ name: 'foo', child: childReference })

    class Foo {
      bar = injectRef(reference)
      bar2 = injectRef({ obj: reference })
    }

    const bean = createBean(Foo)

    expect(bean.bar.name).toBe('foo')
    expect(bean.bar.child.name).toBe('child') // access without value
    expect(bean.bar2.obj.child.name).toBe('child') // access without value
  })
})
