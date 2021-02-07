import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onUnmounted,
  onUpdated,
} from 'vue';
import { ComponentInternalInstance, ComponentOptionsMixin } from 'vue';
import { createInitializerDecorator, GenericBean, Reactive } from "@vue-beans/beans";
import { Decorator } from 'vue-beans/src/types';
import { ComponentClass, createComponent } from "./component";

export function Component(options?: ComponentOptionsMixin) {
  console.warn('DEPRECATED: You should use static way to pass options.')
  function decorator<B, T extends ComponentClass<B>>(KComponent: T): T {
    if (options) {
      Object.assign(KComponent, options);
    }
    return (createComponent(KComponent) as unknown) as T;
  }
  return decorator;
}

export function ReactiveComponent(options?: ComponentOptionsMixin) {
  console.warn('DEPRECATED: You should use static way to pass options and @Reactive() annotation.')
  function decorator<B, T extends ComponentClass<B>>(KComponent: T): T {
    Reactive(KComponent)
    if (options) {
      Object.assign(KComponent, options);
    }
    return (createComponent(KComponent) as unknown) as T;
  }
  return decorator;
}

export function createHook(
  hook: (h: () => boolean | void, target?: ComponentInternalInstance | null) => unknown,
) {
  return function <T extends GenericBean<T>>(): Decorator<T> {
    return createInitializerDecorator<T>((instance, constructor, callback, isStatic) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callbackOwner = (isStatic ? constructor : instance) as any;
      hook(() => (callbackOwner[callback] as () => void)());
    }, 1010);
  };
}

export const OnBeforeMount = createHook(onBeforeMount);
export const OnMounted = createHook(onMounted);
export const OnBeforeUpdate = createHook(onBeforeUpdate);
export const OnUpdated = createHook(onUpdated);
export const OnBeforeUnmount = createHook(onBeforeUnmount);
export const OnUnmounted = createHook(onUnmounted);
export const OnActivated = createHook(onActivated);
export const OnDeactivated = createHook(onDeactivated);
export const OnErrorCaptured = createHook(onErrorCaptured);