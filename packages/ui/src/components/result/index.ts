import type { App, Plugin } from 'vue'
import Result from './Result.vue'
import UnauthorizedIcon from './icons/UnauthorizedIcon.vue'
import NotFoundIcon from './icons/NotFoundIcon.vue'
import ServerErrorIcon from './icons/ServerErrorIcon.vue'
import './style/index.css'

export { default as Result } from './Result.vue'
export * from './types'

const ResultWithExtras = Result as typeof Result &
  Plugin & {
    PRESENTED_IMAGE_403: typeof UnauthorizedIcon
    PRESENTED_IMAGE_404: typeof NotFoundIcon
    PRESENTED_IMAGE_500: typeof ServerErrorIcon
  }

ResultWithExtras.PRESENTED_IMAGE_403 = UnauthorizedIcon
ResultWithExtras.PRESENTED_IMAGE_404 = NotFoundIcon
ResultWithExtras.PRESENTED_IMAGE_500 = ServerErrorIcon

ResultWithExtras.install = function (app: App) {
  app.component('AResult', Result)
  return app
}

export default ResultWithExtras
