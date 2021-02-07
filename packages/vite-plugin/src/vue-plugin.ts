/*

This is not necesary
https://github.com/vitejs/vite/issues/1476

// eslint-disable-next-line import/no-extraneous-dependencies
import vue, { Options } from '@vitejs/plugin-vue';


export default function(rawOptions?: Options) {
  const vuePlugin = vue(rawOptions)


  // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
  const oldTransform = vuePlugin.transform!!

  vuePlugin.transform = async (code, id) => {

    let componentMatch = null;

    if(id.endsWith('.vue')) {
      const classMatch = /export default class ([a-zA-Z0-9]+)/g.exec(code)
      const objectMatch = /export default ([a-zA-Z0-9]+)/g.exec(code)

      componentMatch = (classMatch || objectMatch)
    }

    let newCode = code;
    if(componentMatch) {
      newCode = newCode.replace(`export default class`, 'class')
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await oldTransform(newCode, id);

    if(!componentMatch) return result
    if(!result) return result

    const imp = "import { createComponent } from '@/vuethor';\n"

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result.code = result.code.replace(`const _sfc_main = {}`, `${imp}const _sfc_main = createComponent(${componentMatch[1]})`)
    return result
  }
  return vuePlugin
}

*/