import 'antd/style.js'
import './index.less'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes,
})
new Vue({
  el: '#app',
  router,
})
