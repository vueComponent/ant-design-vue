import { App, Plugin } from 'vue'
import Affix from './Affix.vue'
import './style/index.css'

export { default as Affix } from './Affix.vue'
export * from './meta'

/* istanbul ignore next */
Affix.install = function (app: App) {
  app.component('AAffix', Affix)
  return app
}

export default Affix as typeof Affix & Plugin
