import UserLayout from '../layouts/UserLayout';
import BaseLayout from '../layouts/BaseLayout';
export default [
  {
    path: '/vip',

    component: () => import('../views/vip.vue'),
  },
  {
    path: '/jobs',
    component: BaseLayout,
    props: () => {
      return { name: 'list-cn' };
    },
    children: [
      {
        path: '/jobs',
        redirect: '/jobs/list-cn',
      },
      {
        path: '/jobs/list-cn',
        name: 'list-cn',
        component: () => import(/* webpackChunkName: "jobs" */ '../views/jobs.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        name: 'login',
        component: () =>
          import(
            /* webpackChunkName: "user" */
            '../views/user/login'
          ),
      },
      {
        path: '/user/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '../views/user/register'),
      },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: () => import(/* webpackChunkName: "user" */ '../views/user/register-result'),
      },
    ],
  },
];
