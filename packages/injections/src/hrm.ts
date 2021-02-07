/* eslint-disable */

import { InjectionManager, setCurrentInjectionManager } from "./InjectionManager";
import { BeanConstructor, createBean } from "@vue-beans/beans";

export function loadHrm() {
  // @ts-ignore
  if (process.env.NODE_ENV === 'development') {
    const managers: Set<InjectionManager> = new Set()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const globalObject: any =
      // @ts-ignore
      typeof global !== 'undefined'
        // @ts-ignore
        ? global
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
          ? window
          : {}

    globalObject.__VUE_BEANS_HRM__ = {
      registerChange(hrmId: string, clazz: BeanConstructor<any>) {
        managers.forEach((manager) => {
          setCurrentInjectionManager(manager)
          Object.keys(manager.beans).forEach(it => {
            const reference = manager.beans[it];
            // eslint-disable-next-line no-underscore-dangle
            if(reference.value.__hrmId === hrmId) {
              const oldValue = reference.value
              reference.value = createBean(clazz); // replace with new bean

              Object.keys(oldValue).forEach((key) => {
                if(reference.value[key] === undefined) {
                  reference.value[key] = oldValue[key];
                }
              });

              reference.value.setup();
            }
          });
          setCurrentInjectionManager(null)
        });
      },
      registerManager(manager: InjectionManager) {
        managers.add(manager);
      }
    }
  }
}