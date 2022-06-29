// builders.ts include all functions to build a bean.
import { isProxy, isRef, reactive, shallowReactive } from 'vue';
import { getDescriptors } from './utils';

/**
 * Convert every function of the object to closure, with this you can make
 * const fn = this.makeSomething;
 * fn(); // fn works without problem because has this own context.
 * @param obj
 */
export function remapFunctionsToClosures(obj: any) {
  getDescriptors(obj).forEach(([key, descriptor]) => {
    if (typeof descriptor.value === 'function') {
      obj[key] = obj[key].bind(obj);
    }
  });
  return obj;
}

const isObject = (val: any) => val !== null && typeof val === 'object';

/**
 * Make a object reactive but keeping ref without unwrap.
 * https://github.com/vuejs/vue-next/issues/2756
 * @param obj
 * @constructor
 */
export function reactiveWithRefs(obj: any) {
  return new Proxy(shallowReactive(obj), {
    get(target: any, key: PropertyKey): any {
      const res = target[key];
      // this works like normal reactive proxy, with the difference that this not unwrap refs.
      if (!isObject(res) || isProxy(res) || isRef(res)) return res;
      return reactive(res);
    },
  });
}
