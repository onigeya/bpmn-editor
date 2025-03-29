import { createApp } from 'vue'
import App from './App.vue'
import BpmnEditor from './plugins/index.ts'

const app = createApp(App)
app.use(BpmnEditor, {
  elementPlusOptions: {},
})
app.mount('#app')
