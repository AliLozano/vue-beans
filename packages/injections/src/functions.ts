import { Ref } from 'vue';
import { createLazyProp, GenericBean } from '@vue-beans/beans';
import { getCurrentInjectionManager } from './InjectionManager';
import { BeanConstructorOrBuilder } from "./types";


// eslint-disable-next-line import/prefer-default-export
export function useService<T extends GenericBean<T>>(builder: BeanConstructorOrBuilder<T>): Ref<T> {
  return getCurrentInjectionManager().useAnonymousService(builder);
}

export function injectRef<T>(ref: Ref<T>): T {
  return createLazyProp(
      () => {
        return () => ref.value;
      },
      () => {
        return (value) => {
          ref.value = value;
        };
      },
  );
}

export function injectService<T extends GenericBean<T>>(arg1: new () => T): T {
  return injectRef(useService(arg1));
}