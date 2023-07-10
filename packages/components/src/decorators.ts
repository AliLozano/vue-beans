import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onUnmounted,
  onUpdated
} from 'vue'
import { ComponentInternalInstance, ComponentOptionsMixin } from 'vue'
import {
  Decorator,
  createInitializerDecorator,
  GenericBean,
  Reactive
} from '@vue-beans/beans'
import { ComponentClass, createComponent } from './component'

export function RawComponent(options?: ComponentOptionsMixin) {
  function decorator<B extends GenericBean<B>, T extends ComponentClass<B>>(
    KComponent: T
  ): T {
    if (options) {
      Object.assign(KComponent, options)
    }
    return createComponent(KComponent) as unknown as T
  }
  return decorator
}

export function Component(options?: ComponentOptionsMixin) {
  function decorator<B extends GenericBean<B>, T extends ComponentClass<B>>(
    KComponent: T
  ): T {
    Reactive(KComponent)
    if (options) {
      Object.assign(KComponent, options)
    }
    return createComponent(KComponent) as unknown as T
  }
  return decorator
}

export function ReactiveComponent(options?: ComponentOptionsMixin) {
  return Component(options)
}

export function createHook(
  hook: (
    h: () => boolean | void,
    target?: ComponentInternalInstance | null
  ) => unknown
) {
  return function <T extends GenericBean<T>>(): Decorator<T> {
    return createInitializerDecorator<T>(
      (instance, constructor, callback, isStatic) => {
        const callbackOwner = (isStatic ? constructor : instance) as any
        hook(() => (callbackOwner[callback] as () => void)())
      },
      1010
    )
  }
}

export const OnBeforeMount = createHook(onBeforeMount)
export const OnMounted = createHook(onMounted)
export const OnBeforeUpdate = createHook(onBeforeUpdate)
export const OnUpdated = createHook(onUpdated)
export const OnBeforeUnmount = createHook(onBeforeUnmount)
export const OnUnmounted = createHook(onUnmounted)
export const OnActivated = createHook(onActivated)
export const OnDeactivated = createHook(onDeactivated)
export const OnErrorCaptured = createHook(onErrorCaptured)
