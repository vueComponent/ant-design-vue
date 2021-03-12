import Layout from '../components/layout.vue';
import Iframe from '../components/iframe.vue';
import demoRoutes from './demoRoutes';
import otherRoutes from './otherRoutes';
import VueRouter from 'vue-router';

const routes = [
  ...otherRoutes,
  {
    path: '/components',
    component: Layout,
    props: route => {
      const name = route.path.split('/components/')[1].split('/')[0];
      return { name, showDemo: true };
    },
    children: demoRoutes,
  },
  {
    path: '/iframe',
    component: Iframe,
    children: demoRoutes.map(item => ({
      ...item,
      props: route => {
        const hash = route.hash.replace('#', '');
        return { iframeName: hash };
      },
    })),
  },
  {
    path: '/',
    component: Layout,
    props: route => {
      const name = route.path.split('/docs/vue/')[1].split('/')[0];
      return { name, showApi: true };
    },
    children: [
      {
        path: 'docs/vue/customize-theme',
        component: () => import('../vueDocs/customize-theme.en-US.md'),
      },
      {
        path: 'docs/vue/customize-theme-cn',
        component: () => import('../vueDocs/customize-theme.zh-CN.md'),
      },
      {
        path: 'docs/vue/getting-started',
        component: () => import('../vueDocs/getting-started.en-US.md'),
      },
      {
        path: 'docs/vue/getting-started-cn',
        component: () => import('../vueDocs/getting-started.zh-CN.md'),
      },
      {
        path: 'docs/vue/i18n',
        component: () => import('../vueDocs/i18n.en-US.md'),
      },
      {
        path: 'docs/vue/i18n-cn',
        component: () => import('../vueDocs/i18n.zh-CN.md'),
      },
      {
        path: 'docs/vue/introduce',
        component: () => import('../vueDocs/introduce.en-US.md'),
      },
      {
        path: 'docs/vue/introduce-cn',
        component: () => import('../vueDocs/introduce.zh-CN.md'),
      },
      {
        path: 'docs/vue/use-with-vue-cli',
        component: () => import('../vueDocs/use-with-vue-cli.en-US.md'),
      },
      {
        path: 'docs/vue/use-with-vue-cli-cn',
        component: () => import('../vueDocs/use-with-vue-cli.zh-CN.md'),
      },
      {
        path: 'docs/vue/faq',
        component: () => import('../vueDocs/faq.en-US.md'),
      },
      {
        path: 'docs/vue/faq-cn',
        component: () => import('../vueDocs/faq.zh-CN.md'),
      },
      {
        path: 'docs/vue/download',
        component: () => import('../vueDocs/download.en-US.md'),
      },
      {
        path: 'docs/vue/download-cn',
        component: () => import('../vueDocs/download.zh-CN.md'),
      },
      {
        path: 'docs/vue/sponsor',
        component: () => import('../vueDocs/sponsor.en-US.md'),
      },
      {
        path: 'docs/vue/sponsor-cn',
        component: () => import('../vueDocs/sponsor.zh-CN.md'),
      },
      {
        path: 'docs/vue/changelog',
        component: () => import('../../CHANGELOG.en-US.md'),
      },
      {
        path: 'docs/vue/changelog-cn',
        component: () => import('../../CHANGELOG.zh-CN.md'),
      },
      { path: '', redirect: '/vue/docs/introduce-cn/' },
    ],
  },
  { path: '/*', redirect: '/docs/vue/introduce-cn/' },
];

export default new VueRouter({
  mode: 'history',
  fallback: false,
  routes,
});
