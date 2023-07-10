import { getCurrentInstance, inject as vueInject, Ref, shallowRef } from 'vue'
import { createBean, GenericBean } from '@vue-beans/beans'
import { BeanConstructorOrBuilder, INJECTOR_IDENTIFIER, NONE } from './types'

export const IM_PROVIDER_KEY = 'INJECTION_MANAGER'

export class InjectionManager {
  private static readonly globalFactories: Record<
    string,
    BeanConstructorOrBuilder<GenericBean<any>>
  > = {}

  private readonly localFactories: Record<
    string,
    BeanConstructorOrBuilder<GenericBean<any>>
  > = {}

  public beans: Record<string, Ref> = {}

  constructor() {
    // @ts-ignore
    if (typeof __VUE_BEANS_HRM__ !== 'undefined') {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      __VUE_BEANS_HRM__.registerManager(this) // this should be here?.
      // maybe this could be injected from hrm plugin with something like overriding default setup and having inject
      // also we could register the instance of vue for inject when service reload.
      // maybe check if principal vue instance is injected global, then we can explore managers and don't have to register this manual.
    }
  }

  static registerGlobalBeanFactory(
    name: string,
    initializer: BeanConstructorOrBuilder<any>,
    _override = false
  ): void {
    if (process.env.NODE_ENV === 'development')
      console.info(`Bean Factory ${name} registred globalmente`)
    this.globalFactories[name] = this.globalFactories[name] || initializer
  }

  static unRegisterGlobalBeanFactory(name: string): void {
    if (process.env.NODE_ENV === 'development')
      console.info(`Delete global factory ${name}`)
    delete this.globalFactories[name]
  }

  registerBeanFactory(
    name: string,
    initializer: BeanConstructorOrBuilder<any>
  ): void {
    if (process.env.NODE_ENV === 'development')
      console.info(`Bean Factory ${name} registred`)
    this.localFactories[name] = initializer
  }

  useService<T extends GenericBean<T>>(
    name: string,
    defaultValue?: BeanConstructorOrBuilder<T>
  ): Ref<T> {
    // We could handle local injections, with something like this.. or something like inject and provide for default.
    // const bean = getCurrentVueContext().inject<T>(name, NONE, false);
    // const bean = vueInject(name, NONE as T, false);
    // if (bean !== NONE) return ref<T>(bean) as Ref<T>;
    if (name in this.beans) return this.beans[name]

    const beanFactory =
      this.localFactories[name] ||
      InjectionManager.globalFactories[name] ||
      defaultValue

    if (!beanFactory) {
      throw new Error(`There are no factory for bean: ${name}`)
    }

    try {
      if (process.env.NODE_ENV === 'development')
        console.time(`Bean for ${name} created`)
      const obj = shallowRef() // when reload is true, it exists.
      // We work with the ref to change the reference in every place injected
      this.beans[name] = obj
      obj.value = this.createFactory(beanFactory)() // here build and inject anything (it has to resolve cyclic references before setup())
      if (obj.value.setup) obj.value.setup() // if is a vue-bean and has setup method
      if (process.env.NODE_ENV === 'development')
        console.timeEnd(`Bean for ${name} created`)
      return obj
    } catch (e) {
      console.error(`A error occurred while trying create bean: ${name}: ${e}`)
      throw e
    }
  }

  private static isConstructor(f: unknown) {
    try {
      Reflect.construct(String, [], f as Function)
    } catch (e) {
      return false
    }
    return true
  }

  protected createFactory<T extends GenericBean<T>>(
    builder: BeanConstructorOrBuilder<T>
  ) {
    return (): T => {
      if (InjectionManager.isConstructor(builder)) {
        return createBean(builder as new () => T)
      }
      return (builder as () => T)()
    }
  }

  useAnonymousService<T extends GenericBean<T>>(
    builder: BeanConstructorOrBuilder<T>
  ): Ref<T> {
    let name = builder[INJECTOR_IDENTIFIER]
    if (!name) {
      // We dont use only the name because it doesnt work with minification.
      name = `${builder.name}$${Math.floor(Math.random() * 1000).toString(10)}>`

      // @ts-ignore
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line prefer-destructuring
        name = builder.name // for debugging process.
      }

      builder[INJECTOR_IDENTIFIER] = name
    }
    // Aquí el value puede ser nulo, porque el  use service devuelve la referencia, aunque la creación aún esté en proceso.
    return this.useService(name, builder)
  }
}

let currentInjectionManager: InjectionManager | null = null // for mocks

/**
 * Try to get singleton injection manager of vue instance.
 */
export function getCurrentInjectionManager(): InjectionManager {
  let manager = currentInjectionManager || vueInject(IM_PROVIDER_KEY, NONE)
  if (manager && manager !== NONE) return manager

  manager = new InjectionManager()
  getCurrentInstance()?.appContext.app.provide(IM_PROVIDER_KEY, manager)
  return manager
}

export function setCurrentInjectionManager(
  instance: InjectionManager | null
): void {
  currentInjectionManager = instance
}
