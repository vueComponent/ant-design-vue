import './index.less'
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import VueRouter from 'vue-router'
import routes from './routes'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes,
})
Vue.component('vue-markdown', VueMarkdown)
new Vue({
  el: '#app',
  router,
})
