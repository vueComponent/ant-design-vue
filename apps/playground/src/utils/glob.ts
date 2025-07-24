import { RouteRecordRaw } from 'vue-router'

export function globRoutes(
  baseName: string,
  globs: Record<string, () => Promise<unknown>>,
): RouteRecordRaw {
  const items = Object.entries(globs).map(([path, component]) => {
    const match = path.match(/^\.\/pages\/(.+)\/index\.ts$/)
    if (!match) {
      throw new Error('invalid glob')
    }
    return {
      name: match[1],
      component,
    }
  })

  const home: RouteRecordRaw = {
    path: '',
    components: {
      default: () => import('@/components/HomePage.vue'),
      breadcrumbs: () => import('@/components/TheBreadcrumbs.vue'),
    },
    props: {
      default: {
        items: items.map(item => {
          return {
            name: item.name,
            path: `/${baseName}/${item.name}`,
          }
        }),
      },
      breadcrumbs: {
        items: [
          {
            name: 'home',
            path: '/',
          },
          {
            name: baseName,
            path: `/${baseName}`,
          },
        ],
      },
    },
    meta: {
      name: baseName,
      title: baseName,
    },
  }

  const pages: RouteRecordRaw[] = items.map(item => {
    return {
      path: item.name,
      components: {
        default: item.component,
        breadcrumbs: () => import('@/components/TheBreadcrumbs.vue'),
      },
      props: {
        breadcrumbs: {
          items: [
            {
              name: 'home',
              path: '/',
            },
            {
              name: baseName,
              path: `/${baseName}`,
            },
            {
              name: item.name,
              path: `/${baseName}/${item.name}`,
            },
          ],
        },
      },
      meta: {
        name: item.name,
        title: `${baseName} - ${item.name}`,
      },
    }
  })

  return {
    path: `/${baseName}`,
    component: () => import('@/components/BasicLayout.vue'),
    props: {
      navs: [
        {
          name: 'home',
          path: '/',
        },
      ],
      hideNavbar: true,
      hideBreadcrumbs: true,
    },
    children: [home, ...pages],
  } as RouteRecordRaw
}
