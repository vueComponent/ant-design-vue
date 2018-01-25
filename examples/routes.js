import Demo from './demo.vue'
const AsyncComp = () => {
  return {
    component: import(`../components/button/demo/index.vue`),
  }
}
export default [
  { path: '/components/:name/:demo?', component: Demo },
  { path: '/test/:name/:demo?', component: AsyncComp },
  { path: '/*', redirect: '/components/menu' },
]
