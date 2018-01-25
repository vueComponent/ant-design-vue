import Demo from './components/demo.vue'
const AsyncComp = () => {
  return {
    component: import(`../components/button/demo/index.vue`),
  }
}
export default [
  { path: '/components/:lang/:name/:demo?', component: Demo },
  { path: 'test/:name/:demo', component: AsyncComp },
  { path: '/*', redirect: '/components/cn/menu' },
]
