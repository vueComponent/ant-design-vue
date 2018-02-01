import Demo from './components/demo.vue'
const AsyncComp = () => {
  return {
    component: import(`../components/collapse/demo/index.vue`),
  }
}
export default [
  { path: '/components/:lang/:name/:demo?', component: Demo },
  { path: '/:lang?/test/:name/:demo?', component: AsyncComp },
  { path: '/*', redirect: '/components/cn/menu' },
]
