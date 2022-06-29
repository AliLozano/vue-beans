import { markRaw } from 'vue';
import { GenericBean, BeanConstructor, BEFORE_SETUP, IS_REACTIVE } from './types';
import { remapFunctionsToClosures, reactiveWithRefs } from './builders';
import { loadLazyFields } from './lazy';

/**
 * Run every function that was added to the class as BEFORE_SETUP
 * @param bean
 */
function runBeforeSetup<T extends GenericBean<T>>(bean: T) {
  const constructor = bean.constructor as BeanConstructor<T>;
  const beforeSetup = constructor[BEFORE_SETUP];
  if (beforeSetup) {
    Object.keys(beforeSetup)
      .sort()
      .forEach((key: string) => {
        beforeSetup[parseInt(key, 10)].forEach((it) => {
          it(bean);
        });
      });
  }

  if (constructor.beforeSetup) constructor.beforeSetup();
  if (bean.beforeSetup) bean.beforeSetup();
}

function buildSetupFunction<T extends GenericBean<T>>(bean: T): () => void {
  const oldSetup = bean.setup?.bind(bean);
  const constructor = bean.constructor as BeanConstructor<T>;
  return function (...args: unknown[]) {
    runBeforeSetup(bean);
    if (constructor.setup) constructor.setup(...args);
    if (oldSetup) oldSetup(...args);
  };
}

/**
 * Create a bean with this process:
 * 1. Create the object with empty constructor
 * 2. Convert it to reactive if it has the flag REACTIVE or mark as raw
 * 3. Convert every function of the bean to closure
 * 4. Load lazy field
 * 5. Build setup function from initializers.
 * @param constructor
 */
export function createBean<T extends GenericBean<T>>(constructor: BeanConstructor<T>): T & { setup: (...args: unknown[]) => void } {
  let obj = new constructor();
  // convert their functions to bind this.
  if (constructor[IS_REACTIVE]) {
    obj = reactiveWithRefs(obj);
  } else {
    obj = markRaw(obj);
  }
  obj = remapFunctionsToClosures(obj);
  loadLazyFields(obj);
  obj.setup = buildSetupFunction(obj);
  return obj as T & { setup: (...args: unknown[]) => void };
}
