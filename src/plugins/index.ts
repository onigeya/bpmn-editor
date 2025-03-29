import type { App } from 'vue'
import BpmnEditor from '../components/BpmnEditor.vue'
import ElementPlus, { type ConfigProviderContext } from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
export { BpmnEditor }

export default {
  install: (
    app: App,
    options?: {
      elementPlusOptions?: ConfigProviderContext
    },
  ) => {
    app.use(ElementPlus, options?.elementPlusOptions || {})
    const pinia = createPinia()
    app.use(pinia)
    app.component('BpmnEditor', BpmnEditor)
  },
}
