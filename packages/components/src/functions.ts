import { ExtractPropTypes, getCurrentInstance, SetupContext } from 'vue';
import { ComponentInternalInstance, ComponentPropsOptions, EmitsOptions } from 'vue';

function getVueInstance(): ComponentInternalInstance {
  const instance = getCurrentInstance();
  if (instance === null) {
    throw new Error('You need to call "use" functions ins setup');
  }
  return instance;
}

export function defineProps<T extends ComponentPropsOptions>(props: T) {
  return props;
}

export function useProps<T extends ComponentPropsOptions>(props: T): ExtractPropTypes<T> {
  return getVueInstance().props as ExtractPropTypes<T>;
}

export function useAttrs(): Record<string, unknown> {
  return getVueInstance().attrs;
}

export function useSlots(): Record<string, unknown> {
  return getVueInstance().slots;
}

export function useEmit<E = EmitsOptions>(options: E): SetupContext<E>['emit'] {
  return getVueInstance().emit as SetupContext<E>['emit'];
}
