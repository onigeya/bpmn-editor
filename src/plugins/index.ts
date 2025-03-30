import type { App } from 'vue'
import BpmnEditor from '../components/BpmnEditor.vue'
import ElementPlus, { type ConfigProviderContext } from 'element-plus'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 导出组件
export { BpmnEditor }

// 导出插件安装函数
export const install = (
  app: App,
  options?: {
    elementPlusOptions?: ConfigProviderContext
  },
) => {
  app.use(ElementPlus, options?.elementPlusOptions || {})
  const pinia = createPinia()
  app.use(pinia)
  app.component('BpmnEditor', BpmnEditor)
}

// 兼容默认导出
export default { install }
