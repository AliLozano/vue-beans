import { BeanConstructor, IS_REACTIVE } from './types';

export function Reactive<T1 extends BeanConstructor<any>>(Klass?: T1): any {
  function decorator<T extends BeanConstructor<any>>(Klass: T): T {
    Klass[IS_REACTIVE] = true;
    return Klass;
  }
  if (Klass !== undefined) {
    return decorator(Klass);
  }
  return decorator;
}
