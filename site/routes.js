import Demo from './components/demo.vue'
export default [
  { path: '/:prefix?/components/:name', component: Demo },
  // { path: '/:lang?/test/:name/:demo?', component: AsyncComp },
  { path: '/*', redirect: '/ant-design/components/button' },
]
