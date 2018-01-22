import 'antd/style.js'
import './index.less'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import Md from './md'
Vue.use(VueRouter)
Vue.component(Md.name, Md)

const router = new VueRouter({
  mode: 'hash',
  routes,
})
new Vue({
  el: '#app',
  router,
})
