import type { App, Plugin } from 'vue'
import Button from './Button.vue'
import ButtonGroup from './ButtonGroup.vue'
import './style/index.css'

export { default as Button } from './Button.vue'
export { default as ButtonGroup } from './ButtonGroup.vue'
export * from './types'

Button.Group = ButtonGroup

Button.install = function (app: App) {
  app.component('AButton', Button)
  app.component('AButtonGroup', ButtonGroup)
  return app
}

export default Button as typeof Button &
  Plugin & {
    readonly Group: typeof ButtonGroup
  }
