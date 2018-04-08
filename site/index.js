import '../components/style.js'
import './index.less'
import 'highlight.js/styles/solarized-light.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import routes from './routes'
import Md from './components/md'
import Api from './components/api'
import './components'
import demoBox from './components/demoBox'

Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.component(Md.name, Md)
Vue.component(Api.name, Api)
Vue.component('demo-box', demoBox)

const router = new VueRouter({
  mode: 'history',
  routes,
})
new Vue({
  el: '#app',
  router,
})
