import { Plugin, TransformResult } from 'vite'

export function vueBeansHRMPlugin(
  pattern = /.*(service|api|component)\.ts/
): Plugin {
  return {
    name: 'vite:vue-beans-hrm',
    transform(
      oldCode: string,
      id: string
    ): Promise<TransformResult> | TransformResult | undefined {
      if (!pattern.test(id)) return undefined
      const classMatch = /export default class ([a-zA-Z0-9]+)/g.exec(oldCode)
      const objectMatch = /export default ([a-zA-Z0-9]+)/g.exec(oldCode)

      const match = classMatch || objectMatch
      if (!match) return undefined

      const output = [oldCode.replace('export default', '')]
      output.push(
        `\nconst service = ${match[1]};\n`,
        `import { loadHrm } from "vue-beans"; loadHrm();\n`, // TODO:  this should only in main
        `service.prototype.__hrmId='${id}';\n`,
        `export default service;\n`,
        `if (import.meta.hot) {`,
        `  import.meta.hot.accept(({ default: updated }) => {`,
        `    __VUE_BEANS_HRM__.registerChange('${id}', updated)`,
        `})};`
      )
      // console.log(output.join(''));
      return { code: output.join(''), etag: '', map: null }
    }
  }
}
