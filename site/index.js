import '../components/style.js'
import './index.less'
import 'highlight.js/styles/solarized-light.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import routes from './routes'
import Md from './components/md'
import Api from './components/api'
import * as Components from '../components/index'
import demoBox from './components/demoBox'

Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.component(Md.name, Md)
Vue.component(Api.name, Api)
Vue.component('demo-box', demoBox)
Object.keys(Components).forEach(k => {
  if (k === 'api') {
    Object.keys(Components[k]).forEach(api => {
      Vue.prototype[`$${api}`] = Components[k][api]
    })
  } else {
    const name = `a${k.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    Vue.component(name, Components[k])
  }
})

const router = new VueRouter({
  mode: 'history',
  routes,
})
new Vue({
  el: '#app',
  router,
})
