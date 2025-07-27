import '~/tailwind.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'
import antd from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).use(antd).mount('#app')
