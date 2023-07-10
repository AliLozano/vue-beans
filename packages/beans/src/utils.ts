import { computed, isRef } from 'vue'

/**
 * Obtain the descriptor of every method or properties of an object
 * This method excluded every element with _ or $ (that are considered private members)
 * @param instance
 */
export function getDescriptors<T>(instance: T): [string, PropertyDescriptor][] {
  let obj = instance
  let props: { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & {
    [x: string]: PropertyDescriptor
  } = Object.getOwnPropertyDescriptors(obj)

  // eslint-disable-next-line no-cond-assign
  while ((obj = Object.getPrototypeOf(obj))) {
    // while it has parents
    props = { ...props, ...Object.getOwnPropertyDescriptors(obj) }
  }

  const exclude = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    'apply',
    'arguments',
    'bind',
    'call',
    'caller',
    'prototype'
  ]

  return Object.entries(props).filter(
    ([key, _]) =>
      !key.startsWith('_') && !key.startsWith('$') && exclude.indexOf(key) < 0
  )
}

/**
 * Encapsulate every field of a object in computed access and closure functions
 * And return the map of
 * if field is attribute -> returns computed
 * if field is setter/getter -> return computed
 * if field is Ref -> return the ref
 * if field is function -> return the function as closure.
 * @param original
 * @param descriptors
 */
export function wrapFields(
  original: { [id: string]: unknown },
  descriptors: [string, PropertyDescriptor][]
): Record<string, unknown> {
  const context: { [id: string]: unknown } = {}

  descriptors.forEach(([key, descriptor]) => {
    if (descriptor.get) {
      const get = () => descriptor.get?.call(original)
      if (descriptor.set) {
        const set = (newValue: unknown) =>
          descriptor.set?.call(original, newValue)
        context[key] = computed({ get, set })
      } else {
        context[key] = computed(get)
      }
    } else if (descriptor.set) {
      // only setter ?? is it neccesary?.
    } else if (typeof descriptor.value === 'function') {
      context[key] = (...args: unknown[]) =>
        (original[key] as any).call(original, ...args)
    } else if (isRef(original[key])) {
      context[key] = original[key]
    } else {
      context[key] = computed({
        get: () => original[key],
        set: arg => {
          original[key] = arg
        }
      })
    }
  })

  return { ...context }
}

/**
 * Define a getter of an object
 * @param o
 * @param p
 * @param getter
 */
export function defineGetter(
  o: any,
  p: PropertyKey,
  getter: () => unknown
): void {
  Object.defineProperty(o, p, {
    get: getter,
    set: undefined,
    enumerable: true,
    configurable: true
  })
}
