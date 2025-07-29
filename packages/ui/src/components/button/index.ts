import { App, Plugin } from 'vue'
import Button from './Button.vue'
import './style/index.css'

export { default as Button } from './Button.vue'
export * from './meta'

/* istanbul ignore next */
Button.install = function (app: App) {
  app.component('AButton', Button)
  return app
}

export default Button as typeof Button & Plugin
