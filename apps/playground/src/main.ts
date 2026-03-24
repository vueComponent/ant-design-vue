import '~/tailwind.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'
import antd from '@ant-design-vue/ui'
import '@ant-design-vue/ui/tailwind.css'
import '@ant-design-vue/ui/style.css'
import * as Icons from '@ant-design/icons-vue'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
Object.entries(Icons).forEach(([name, component]) => {
  if (typeof component === 'object' || typeof component === 'function') {
    app.component(name, component as any)
  }
})
app.use(router).use(antd).mount('#app')
