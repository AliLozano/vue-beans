import { Decorator, createInitializerDecorator } from '@vue-beans/beans'

type ReturnHandler = boolean | unknown

type HandlerFn<T> = (ex: Error, instance: T, ...args: unknown[]) => ReturnHandler
type OnSuccessFn<T> = (data: unknown, instance: T, ...args: unknown[]) => unknown

type HandlerFnGetter<T> = (it: T) => HandlerFn<T>
type OnSuccessGetter<T> = (it: T) => OnSuccessFn<T>

/*
 * Return the method function wrapping with a try catch using handler
 * */
function catchingWrapper<T>(
  instance: T,
  method: (...args: unknown[]) => unknown,
  handler: HandlerFn<T>,
  onSuccess: OnSuccessFn<T>
) {
  const handleError = (error: Error, ...args: unknown[]) => {
    const dontStopPropagation = handler(error, instance, ...args)
    if (dontStopPropagation === false) throw error
    return dontStopPropagation
  }

  return (...args: unknown[]) => {
    try {
      const result = method.apply(instance, args) as any
      if (result && result.then) {
        return result
          .then((data: unknown) => {
            onSuccess(data, instance, ...args)
            return data
          })
          .catch((error: Error) => {
            return handleError(error, ...args)
          })
      }
      onSuccess(result, instance, ...args)
      return result
    } catch (e) {
      return handleError(e, ...args)
    }
  }
}

type PartialRecord<K extends keyof any, T> = { [P in K]?: T } // allows classes with optional fields.

/**
 * Allows to annotate a function and catch any exception
 * @param getHandler a function called when an error happens. The functionis called with the error, instance, fnArgs
 * @param getOnSuccess a function called everytime when the function is executed successfully. The function is called with the parameters result, instance, fnArgs
 * @constructor
 */
export function CatchException<T extends PartialRecord<keyof T, unknown>>(
  getHandler: HandlerFnGetter<T>,
  getOnSuccess: OnSuccessGetter<T> = () => data => data // dummy function
): Decorator<T> {
  return createInitializerDecorator<T>((instance, constructor, callback, isStatic) => {
    const callbackOwner = (isStatic ? constructor : instance) as { [key: string]: () => unknown }
    const fnHandler = getHandler(instance as T)
    const fnOnSuccess = getOnSuccess(instance as T)
    const fnToWrap = callbackOwner[callback] as (...args: unknown[]) => unknown
    callbackOwner[callback] = catchingWrapper<T>(instance as T, fnToWrap, fnHandler, fnOnSuccess)
  })
}
