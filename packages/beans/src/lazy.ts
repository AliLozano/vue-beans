import { GenericBean } from './types';

export declare type GetterFunction<T, B = GenericBean<unknown>> = (name: string, instance: B) => () => T;

// eslint-disable-next-line prettier/prettier
export declare type SetterFunction<T, B = GenericBean<unknown>> = (name: string, instance: B) => ((newValue: T) => void);

const LAZY_GETTER: unique symbol = Symbol('LAZY_GETTER');
const LAZY_SETTER: unique symbol = Symbol('LAZY_SETTER');
/**
 * LazyProp is a temporal object that works like a flag when we cant get a value yet
 * Or we want to use the name of the property or we want to create a getter of an object like ref.
 */
export interface LazyProp<T, B = GenericBean<unknown>> {
    [LAZY_GETTER]: GetterFunction<T, B>;
    [LAZY_SETTER]: SetterFunction<T, B> | undefined;
}


export function createLazyProp<T, B = GenericBean<unknown>>(
  getter: GetterFunction<T, B>,
  setter?: SetterFunction<T, B>,
): T {
  return {
      [LAZY_GETTER]: getter,
      [LAZY_SETTER]: setter
  } as unknown as T;
}


/**
 * Change every LazyProp of instance with its respective getter and setter.
 * @param instance
 */
export function loadLazyFields<T extends GenericBean<T>>(instance: T): T {
  Object.entries(instance)
      .filter(([_, value]) => value && (value as any)[LAZY_GETTER])
      .forEach(([key, value]) => {
        const lazyInjector = (value as unknown) as LazyProp<unknown, T>;
        const getter = lazyInjector[LAZY_GETTER](key, instance);
        const setter = lazyInjector[LAZY_SETTER] ? lazyInjector[LAZY_SETTER]!!(key, instance) : undefined;
        Object.defineProperty(instance, key, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true,
        });
      });
  return instance;
}
