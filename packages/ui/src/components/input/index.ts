import { App, Plugin } from 'vue'
import Input from './Input.vue'
import './style/index.css'

// 导出组件
export { default as Input } from './Input.vue'
export * from './meta'

/* istanbul ignore next */
Input.install = function (app: App) {
  app.component('AInput', Input)
  return app
}

export default Input as typeof Input & Plugin
