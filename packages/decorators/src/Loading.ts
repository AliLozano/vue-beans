import { createInitializerDecorator, Decorator, GenericBean } from '@vue-beans/beans';

function isPromise(value: any): value is Promise<unknown> {
  return Boolean(value && typeof value.then === 'function');
}

export function Loading<T extends GenericBean<T>>(loadingKey: keyof Required<T>): Decorator<T> {
  // TODO: refactor to add syncronized flag to run methods in sequences.
  return createInitializerDecorator((instance, constructor, callback, _) => {
    const obj = instance as any;
    const oldMethod = obj[callback] as (...args: unknown[]) => unknown;

    obj[callback] = (...args: unknown[]) => {
      const loading = (status: boolean) => {
        obj[loadingKey] = status;
      };
      if (obj[loadingKey]) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Skipping call of ${String(loadingKey)} because it is already running`);
        }
        return; // cancel if it already running
      }
      loading(true);
      try {
        const result = oldMethod.apply(instance, args);

        if (isPromise(result)) {
          // eslint-disable-next-line consistent-return
          return result
            .then((data: unknown) => {
              loading(false);
              return data;
            })
            .catch((error) => {
              loading(false);
              throw error;
            });
        } else {
          loading(false);
        }
        // eslint-disable-next-line consistent-return
        return result;
      } catch (e) {
        loading(false);
        throw e;
      }
    };
  }, 1000);
}
