import { Prop } from 'vue';
import { createLazyProp } from '@vue-beans/beans';
import { useProps } from './functions';

export function injectProp<T>(options?: Prop<T, T>): T;

export function injectProp<T>(name?: string, options?: Prop<T, T>): T;

export function injectProp<T>(arg1?: string | Prop<T, T>, arg2?: Prop<T, T>): T {
  return createLazyProp<T>((name, instance) => {
    // TODO: warn if instance doesnt have prop as static.
    const propName = arg1 instanceof String ? (arg1 as string) : name;
    const props = useProps({ [propName]: Object });
    // Return the getter, and as props is reactive, this should work like computed.
    return () => props[propName] as T;
  });
}
