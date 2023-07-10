import {
  BeanConstructor,
  createBean,
  GenericBean,
  defineGetter,
  getDescriptors,
  wrapFields
} from '@vue-beans/beans'
import { SetupContext, Component as VueComponent, watch } from 'vue'

export type ComponentClass<T extends GenericBean<T>> = (new () => T) & {
  __vccOpts?: VueComponent
  __vccOptsCached?: VueComponent
  render?: Function
} & BeanConstructor<T>

export function createComponent<T extends GenericBean<T>>(
  KComponent: ComponentClass<T>
): any {
  if (KComponent.setup) return KComponent // if already has setup.
  const staticFields = wrapFields(
    KComponent as never,
    getDescriptors(KComponent)
  )
  const options = getDescriptors(KComponent).reduce(
    (map, [key, _]) => ({ ...map, [key]: (KComponent as any)[key] }),
    {}
  )

  defineGetter(KComponent, '__vccOpts', () => {
    return {
      ...options,
      render: KComponent.render,
      setup(this: void, props: Record<string, unknown>, ctx: SetupContext) {
        const component = createBean(KComponent)
        component.setup(props, ctx)
        if (component.eventbus) {
          // Use bus when it has
          const bus = component.eventbus
          Object.keys(bus).forEach(event => {
            watch(
              () => bus[event],
              (evt: any) => {
                ctx.emit(evt.type, evt.value)
              }
            )
          })
        }

        const fields = wrapFields(component, getDescriptors(component))
        return { ...staticFields, ...fields }
      }
    }
  })
  // return KComponent
  // TODO: This should return only KComponent, but doesnt works.
  // eslint-disable-next-line no-underscore-dangle
  return KComponent.__vccOpts
}
