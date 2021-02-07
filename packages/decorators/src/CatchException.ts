import { createInitializerDecorator } from "@vue-beans/beans";
import { Decorator } from "vue-beans/src/types";

type ReturnHandler = boolean | unknown;

type HandlerFn<T> = (ex: Error, instance: T) => ReturnHandler;

type HandlerFnGetter<T> = (it: T) => HandlerFn<T>;

/*
 * Return the method function wrapping with a try catch using handler
 * */
function catchingWrapper<T>(
    instance: T,
    method: (...args: unknown[]) => unknown,
    handler: HandlerFn<T>,
) {
    const handleError = (error: Error) => {
        const dontStopPropagation = handler(error, instance);
        if (dontStopPropagation === false) throw error;
        return dontStopPropagation;
    };

    return (...args: unknown[]) => {
        try {
            const result = method.apply(instance, args) as any;
            if (result && result.then) {
                return result.catch((error: Error) => {
                    return handleError(error);
                });
            }
            return result;
        } catch (e) {
            return handleError(e);
        }
    };
}

export function CatchException<T extends Record<keyof T, unknown>>(getHandler: HandlerFnGetter<T>): Decorator<T> {
    return createInitializerDecorator<T>((instance, constructor, callback, isStatic) => {
        const callbackOwner = (isStatic ? constructor : instance) as { [key: string]: () => unknown };
        const fnHandler = getHandler(instance as T);
        const fnToWrap = callbackOwner[callback] as (...args: unknown[]) => unknown;
        callbackOwner[callback] = catchingWrapper<T>(instance as T, fnToWrap, fnHandler);
    });
}
