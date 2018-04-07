import Demo from './components/demo.vue'
const AsyncComp = () => {
  const d = window.location.hash.replace('#', '')
  return {
    component: import(`../components/transfer/demo/${d}`),
  }
}
export default [
  { path: '/:prefix?/components/:name/', component: Demo },
  { path: '/:prefix?/test/:demo?/', component: AsyncComp },
  { path: '/*', redirect: '/ant-design/components/button/' },
]
