import { Plugin, TransformResult } from 'vite';

export function vueBeansPlugin(pattern = /.*(service|api|component)\.ts/): Plugin {
  return {
    name: 'vite:vue-beans',
    transform(oldCode: string, id: string): Promise<TransformResult> | TransformResult | undefined {
      if(!pattern.test(id)) return undefined;
      const classMatch = /export default class ([a-zA-Z0-9]+)/g.exec(oldCode)
      const objectMatch = /export default ([a-zA-Z0-9]+)/g.exec(oldCode)

      const match = (classMatch || objectMatch)
      if(!match) return undefined

      const output = [oldCode.replace('export default', '')]
      output.push(`\nconst service = ${match[1]};\n`,
          `service.prototype.__hrmId='${id}';\n`,
          `export default service;\n`,
          `if (import.meta.hot) {`,
          `  import.meta.hot.accept(({ default: updated }) => {`,
          `    __VUE_BEANS_HRM__.registerChange('${id}', updated)`,
          `})};`
      )
      // console.log(output.join(''));
      return { code: output.join(''), etag: '', map: null }
    } // TODO: Inject en el main import hrm from 'vue-beans/injectors'; hrm()
    // for enable injects.
  }
}
