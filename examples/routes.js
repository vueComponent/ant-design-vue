const AsyncComp = () => {
  const pathnameArr = window.location.pathname.split('/')
  const com = pathnameArr[1] || 'button'
  const demo = pathnameArr[2] || 'index'
  return {
    component: import(`../components/menu/demo/${demo}.vue`),
  }
}
export default [
  { path: '/*', component: AsyncComp },
]
