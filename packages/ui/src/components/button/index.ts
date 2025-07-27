import { App, Plugin } from 'vue'
import Button from './Button.vue'

/* istanbul ignore next */
Button.install = function (app: App) {
  app.component('AButton', Button)
  return app
}

export default Button as typeof Button & Plugin
