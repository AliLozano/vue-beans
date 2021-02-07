import { GenericBean } from './types';

export declare type GetterFunction<T, B = GenericBean<unknown>> = (name: string, instance: B) => () => T;

// eslint-disable-next-line prettier/prettier
export declare type SetterFunction<T, B = GenericBean<unknown>> = (name: string, instance: B) => ((newValue: T) => void);

/**
 * LazyProp is a temporal object that works like a flag when we cant get a value yet
 * Or we want to use the name of the property or we want to create a getter of an object like ref.
 */
export class LazyProp<T, B = GenericBean<unknown>> {
  public getter: GetterFunction<T, B>;

  public setter: SetterFunction<T, B> | undefined;

  constructor(getter: GetterFunction<T, B>, setter?: SetterFunction<T, B>) {
    this.getter = getter;
    this.setter = setter;
  }
}

export function createLazyProp<T, B = GenericBean<unknown>>(
  getter: GetterFunction<T, B>,
  setter?: SetterFunction<T, B>,
): T {
  return (new LazyProp(getter, setter) as unknown) as T;
}


/**
 * Change every LazyProp of instance with its respective getter and setter.
 * @param instance
 */
export function loadLazyFields<T extends GenericBean<T>>(instance: T): T {
  Object.entries(instance)
      .filter(([_, value]) => value instanceof LazyProp)
      .forEach(([key, value]) => {
        const lazyInjector = (value as unknown) as LazyProp<unknown, T>;
        const getter = lazyInjector.getter(key, instance);
        const setter = lazyInjector.setter ? lazyInjector.setter(key, instance) : undefined;
        Object.defineProperty(instance, key, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true,
        });
      });
  return instance;
}
