import { Plugin, TransformResult } from 'vite'

export function vueBeansComponentsPlugin(): Plugin {
  return {
    name: 'vite:vue-beans-components',
    transform(
      oldCode: string,
      id: string
    ): Promise<TransformResult> | TransformResult | undefined {
      if (!id.endsWith('.vue')) return undefined

      const newCode = oldCode.replace(
        /const _sfc_main = (.*);/, // only when is one line (when is class)
        `import { createComponent } from 'vue-beans';\n` +
          `const _sfc_main = createComponent($1)`
      )
      return { code: newCode, etag: '', map: null }
    }
  }
}
