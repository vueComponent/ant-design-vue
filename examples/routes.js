import Demo from './components/demo.vue'
const AsyncComp = () => {
  return {
    component: import(`../components/card/demo/basic.vue`),
  }
}
export default [
  { path: '/components/:lang/:name/:demo?', component: Demo },
  { path: 'test/:name/:demo', component: AsyncComp },
  { path: '/*', redirect: '/components/cn/menu' },
]
