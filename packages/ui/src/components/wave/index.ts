import { App, Plugin } from 'vue'
import Wave from './Wave.vue'
import './style/index.css'

export { default as Wave } from './Wave.vue'

/* istanbul ignore next */
Wave.install = function (app: App) {
  app.component('AWave', Wave)
  return app
}
export default Wave as typeof Wave & Plugin
