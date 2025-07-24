import { RouteRecordRaw } from 'vue-router'

const items = import.meta.glob('./pages/*/index.ts', { import: 'default', eager: true })
export default Object.values(items) as RouteRecordRaw[]
