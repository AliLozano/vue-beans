import { watch, WatchOptions } from 'vue'
import {
  Decorator,
  createInitializerDecorator,
  GenericBean
} from '@vue-beans/beans'

export function Watch<T extends GenericBean<T>>(
  prop: (obj: T) => unknown,
  options?: WatchOptions
): Decorator<T> {
  return createInitializerDecorator<T>(
    (instance, constructor, callback, isStatic) => {
      const callbackOwner = (isStatic ? constructor : instance) as any
      watch(
        () => prop(instance as T),
        (it: unknown) =>
          (callbackOwner[callback] as (param: unknown) => void)(it),
        options
      )
    },
    1000
  ) // priority of initializer
}
