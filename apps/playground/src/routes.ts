import { RouteRecordRaw, RouterView } from 'vue-router'
import BasicLayout from './components/BasicLayout.vue'
import { Fragment, h } from 'vue'

// /pages/button/basic.vue
const items = import.meta.glob('./pages/*/*.vue', { import: 'default', eager: true })

const categoryRoutes: Record<string, RouteRecordRaw[]> = {}

Object.keys(items).forEach(path => {
  const route = path.replace('./pages/', '').replace('.vue', '')
  const [category, demo] = route.split('/')

  if (!categoryRoutes[category]) {
    categoryRoutes[category] = []
  }

  categoryRoutes[category].push({
    path: demo,
    component: items[path],
  })
})

const routes: RouteRecordRaw[] = Object.entries(categoryRoutes).map(([category, children]) => {
  const renderComponents = () =>
    h(
      'div',
      children.map(child => h(child.component)),
    )
  renderComponents.displayName = 'renderComponents'
  return {
    path: `/${category}`,
    component: RouterView,
    children: [
      ...children,
      {
        path: ':demo*',
        component: renderComponents,
      },
    ],
  }
})

const navs = Object.keys(categoryRoutes).map(category => ({
  name: category,
  path: `/${category}`,
  children: categoryRoutes[category].map(child => ({
    name: child.path,
    path: `/${category}/${child.path}`,
  })),
}))
routes.push({
  path: '/:pathMatch(.*)*',
  component: h('div', 'demo not found'),
})
export default [
  {
    path: '/',
    component: BasicLayout,
    children: routes,
    props: {
      navs,
    },
  },
]
