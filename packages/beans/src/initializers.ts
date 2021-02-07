import { GenericBean, BeanConstructor, BeanInitializer, BEFORE_SETUP, Decorator } from './types';

/**
 * @param instance instance where the initializer is applied
 * @param constructor class where the initializer is applied
 * @param attributeName name of the attribute / function where the decorator was applied
 * @param isStatic true when the decorator is being applied to static function or attribute
 */
type DecoratorInitializer<T extends GenericBean<T>> = (
  instance: Record<string, any>,
  constructor: typeof instance.constructor,
  attributeName: string,
  isStatic: boolean,
) => void;

/**
 * This method add a initializer for any class to be run before setup.
 * @param constructor define the class to be modified with new initializer
 * @param priority define the priority.
 * @param initializer function that receive the current bean.
 * @param override all
 */
export function addInitializer<Type extends GenericBean<Type>>(
  constructor: BeanConstructor<Type>,
  priority: number,
  initializer: BeanInitializer<Type>,
  overrideAll = false,
): void {
  constructor[BEFORE_SETUP] = constructor[BEFORE_SETUP] || {};

  if (!constructor[BEFORE_SETUP]![priority] || overrideAll) {
    constructor[BEFORE_SETUP]![priority] = [initializer];
  } else {
    constructor[BEFORE_SETUP]![priority].push(initializer);
  }
}

/**
 * Return a decorator for functions or constructor to add custom initializers to the class
 * @param initializer function that runs on setup function of bean
 * @param priority priority of the initializer
 */
export function createInitializerDecorator<T extends GenericBean<T>>(
  initializer: DecoratorInitializer<T>,
  priority = 2000,
): Decorator<T> {
  function decorator(obj: T | BeanConstructor<T>, callback: string): void {
    const isStatic = typeof obj === 'function';
    const constructor = (isStatic ? obj : obj.constructor) as new () => T;

    addInitializer(constructor, priority, (instance: T) => {
      initializer(instance, instance.constructor, callback, isStatic);
    });
  }
  return decorator;
}
