export * from './hook'

import { App, Plugin } from 'vue'
import Theme from './Theme.vue'

export { Theme }

/* istanbul ignore next */
Theme.install = function (app: App) {
  app.component('ATheme', Theme)
  return app
}

export default Theme as typeof Theme & Plugin
