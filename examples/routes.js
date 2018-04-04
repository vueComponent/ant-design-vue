import Demo from './components/demo.vue'
const AsyncComp = () => {
  const hashs = window.location.hash.split('/')
  const d = hashs[hashs.length - 1]
  return {
<<<<<<< HEAD
    component: import(`../components/vc-m-feedback/demo/${d}`),
=======
    component: import(`../components/table/demo/${d}`),
>>>>>>> 5d2271a131c74d672cc0cfada07e256752160b41
  }
}
export default [
  { path: '/:lang?/components/:name/:demo?/:other?', component: Demo },
  { path: '/:lang?/test/:name/:demo?', component: AsyncComp },
  { path: '/*', redirect: '/us/components/button' },
]
