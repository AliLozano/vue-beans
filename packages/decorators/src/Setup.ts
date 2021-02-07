import { createInitializerDecorator, GenericBean } from "@vue-beans/beans";
import { Decorator } from 'vue-beans/src/types';

export function Setup<T extends GenericBean<T>>(): Decorator<T> {
    return createInitializerDecorator<T>((instance, constructor, callback, isStatic) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const callbackOwner = (isStatic ? constructor : instance) as any;
        callbackOwner[callback]();
    }, 10000);
}
