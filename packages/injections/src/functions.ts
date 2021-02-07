import { Ref } from 'vue';
import { GenericBean } from 'vue-beans';
import { getCurrentInjectionManager } from './InjectionManager';
import { BeanConstructorOrBuilder } from "./types";


// eslint-disable-next-line import/prefer-default-export
export function useService<T extends GenericBean<T>>(builder: BeanConstructorOrBuilder<T>): Ref<T> {
  return getCurrentInjectionManager().useAnonymousService(builder);
}
