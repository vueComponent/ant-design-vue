import 'babel-polyfill'
import '../components/style.js'
import './index.less'
import 'highlight.js/styles/solarized-light.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import Md from './components/md'
import Api from './components/api'
import './components'
import demoBox from './components/demoBox'
import demoContainer from './components/demoContainer'
import Test from '../components/test/index'

Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.component(Md.name, Md)
Vue.component(Api.name, Api)
Vue.component('demo-box', demoBox)
Vue.component('demo-container', demoContainer)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/*', component: Test },
  ],
})
new Vue({
  el: '#app',
  router,
})
