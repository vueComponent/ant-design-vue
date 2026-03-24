import type { RouteRecordRaw } from 'vue-router'
import { componentGroups } from '#/data/demos'
import BrowseView from '#/views/BrowseView.vue'
import EditorView from '#/views/EditorView.vue'
import CompareView from '#/views/CompareView.vue'

const firstComponent = componentGroups[0]?.name ?? 'button'

export default [
  { path: '/', redirect: `/${firstComponent}` },
  { path: '/playground', component: EditorView },
  { path: '/compare/:component', component: CompareView },
  { path: '/:component', component: BrowseView },
  { path: '/:component/:demo', component: EditorView },
] as RouteRecordRaw[]
