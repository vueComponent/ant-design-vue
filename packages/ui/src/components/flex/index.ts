import { App, Plugin } from 'vue'
import Flex from './Flex.vue'
import './style/index.css'


export { default as Flex } from './Flex.vue'
export * from './meta'

Flex.install = function (app: App) {
  app.component('AFlex', Flex)
  return app
}

export default Flex as typeof Flex & Plugin
