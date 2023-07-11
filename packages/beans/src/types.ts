import { Prop } from 'vue'

export const IS_REACTIVE: unique symbol = Symbol('IS_REACTIVE')
export const BEFORE_SETUP: unique symbol = Symbol('BEFORE_SETUP') as any

declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>

declare type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends
    | {
        required: true
      }
    | {
        default: any
      }
    | BooleanConstructor
    | {
        type: BooleanConstructor
      }
    ? K
    : never
}[keyof T]

declare type InferPropType<T> = T extends null
  ? any
  : T extends {
      type: null | true
    }
  ? any
  : T extends
      | ObjectConstructor
      | {
          type: ObjectConstructor
        }
  ? Record<string, any>
  : T extends
      | BooleanConstructor
      | {
          type: BooleanConstructor
        }
  ? boolean
  : T extends Prop<infer V, infer D>
  ? unknown extends V
    ? D
    : V
  : T

export type EventBus<O> = O extends object
  ? {
      [K in RequiredKeys<O>]: { value: InferPropType<O[K]>; type: string } & ((
        value: InferPropType<O[K]>
      ) => void)
    } & {
      [K in OptionalKeys<O>]: { value?: InferPropType<O[K]>; type: string } & ((
        value?: InferPropType<O[K]>
      ) => void)
    }
  : { [K in string]: any }

export type Bean = {
  beforeSetup?: (...args: unknown[]) => void
  setup?: (...args: unknown[]) => void
  eventbus?: EventBus<unknown>
}

type PartialRecord<K extends keyof any, T> = { [P in K]?: T }

export type GenericBean<T> = PartialRecord<keyof T, unknown> & Bean

export declare type BeanInitializer<T extends GenericBean<T>> = (
  instance: T
) => void

export declare type BeanConstructor<T extends GenericBean<T>> =
  (new () => T) & {
    [IS_REACTIVE]?: boolean
    [BEFORE_SETUP]?: Record<number, Array<BeanInitializer<T>>>

    beforeSetup?: (...args: unknown[]) => void
    setup?: (...args: unknown[]) => void
  }

export declare type Decorator<T> = (
  instance: T | (new () => T),
  callback: string
) => void
