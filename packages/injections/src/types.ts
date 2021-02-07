import { BeanConstructor, GenericBean } from "@vue-beans/beans";

export const INJECTOR_IDENTIFIER: unique symbol = Symbol('INJECTOR_IDENTIFIER');
export const NONE: unique symbol = Symbol('No injection found') as any;

export interface BeanConstructorInjectable<T extends GenericBean<T>> extends BeanConstructor<T> {
    [INJECTOR_IDENTIFIER]?: string;
}

export declare type BeanBuilder<T extends GenericBean<T>> = (() => T) & { [INJECTOR_IDENTIFIER]?: string };

export declare type BeanConstructorOrBuilder<T extends GenericBean<T>> = BeanConstructorInjectable<T> | BeanBuilder<T>;