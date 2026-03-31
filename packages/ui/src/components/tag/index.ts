import type { App, Plugin } from 'vue'
import Tag from './Tag.vue'
import CheckableTag from './CheckableTag.vue'
import './style/index.css'

export { default as Tag } from './Tag.vue'
export { default as CheckableTag } from './CheckableTag.vue'
export * from './types'

Tag.install = function (app: App) {
  app.component('ATag', Tag)
  app.component('ACheckableTag', CheckableTag)
  return app
}

;(Tag as any).CheckableTag = CheckableTag

export default Tag as typeof Tag &
  Plugin & {
    readonly CheckableTag: typeof CheckableTag
  }
