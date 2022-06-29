import { Decorator, createInitializerDecorator, GenericBean } from '@vue-beans/beans';

export function Setup<T extends GenericBean<T>>(): Decorator<T> {
  return createInitializerDecorator<T>((instance, constructor, callback, isStatic) => {
    if (callback === 'setup') {
      console.warn("You shouldn't annotate setup function with @Setup. @Setup will be ignored.");
      return;
    }
    const callbackOwner = (isStatic ? constructor : instance) as any;
    callbackOwner[callback]();
  }, 10000);
}
