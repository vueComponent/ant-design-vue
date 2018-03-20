import Demo from './components/demo.vue'
const AsyncComp = () => {
  const hashs = window.location.hash.split('/')
  const d = hashs[hashs.length - 1]
  return {
    component: import(`../components/locale-provider/demo/${d}`),
  }
}
export default [
  { path: '/:lang?/components/:name/:demo?/:other?', component: Demo },
  { path: '/:lang?/test/:name/:demo?', component: AsyncComp },
  { path: '/*', redirect: '/cn/components/select' },
]
