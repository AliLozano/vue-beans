import { ref, Ref, UnwrapRef } from 'vue'
import { createLazyProp, GenericBean } from '@vue-beans/beans'
import { getCurrentInjectionManager } from './InjectionManager'
import { BeanConstructorOrBuilder } from './types'

export function useService<T extends GenericBean<T>>(
  builder: BeanConstructorOrBuilder<T>
): Ref<T> {
  return getCurrentInjectionManager().useAnonymousService(builder)
}

export function injectRef<T>(ref_: T): UnwrapRef<T> {
  const obj = ref(ref_) // unwrap anything
  return createLazyProp(
    () => {
      return () => obj.value // is unwrapped
    },
    () => {
      return (value: UnwrapRef<T>) => {
        obj.value = value
      }
    }
  ) as typeof obj.value
}

export function injectService<T extends GenericBean<T>>(arg1: new () => T): T {
  return injectRef(useService(arg1))
}
