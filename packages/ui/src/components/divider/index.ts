import type { App, Plugin } from 'vue'
import Divider from './divider.vue'
import './style/index.css'

export { default as  Divider } from './divider.vue'

Divider.install = function(app: App){
  app.component('ADivider', Divider)
  return app
}

export default Divider as typeof Divider & Plugin
