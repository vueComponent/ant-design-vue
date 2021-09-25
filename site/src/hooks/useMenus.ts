import { groupBy, sortBy } from 'lodash-es';
import type { ComputedRef } from 'vue';
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GLOBAL_CONFIG } from '../SymbolKey';
const typeOrder: any = {
  组件总览: { order: -1, en: 'Overview' },
  通用: { order: 0, en: 'General' },
  布局: { order: 1, en: 'Layout' },
  导航: { order: 2, en: 'Navigation' },
  数据录入: { order: 3, en: 'Data Entry' },
  数据展示: { order: 4, en: 'Data Display' },
  反馈: { order: 5, en: 'Feedback' },
  其他: { order: 6, en: 'Other' },
  废弃: { order: 7, en: 'Deprecated' },
};
const useMenus = (): {
  menus: ComputedRef<any[]>;
  dataSource: ComputedRef<any[]>;
  currentMenuIndex: ComputedRef<number>;
  activeMenuItem: ComputedRef<string>;
} => {
  const route = useRoute();
  const router = useRouter();
  const routes = router.getRoutes();
  const globalConfig = inject<any>(GLOBAL_CONFIG);
  const menus = computed(() => {
    const path = route.path;
    const category = path.split('/')[1];
    const pattern = /^\/iframe/;
    const isZhCN = globalConfig.isZhCN.value;
    const ms = routes
      .filter(r => {
        const inCategory =
          r.meta &&
          r.meta.category &&
          (r.meta.category as string).toLowerCase() === category &&
          !pattern.test(r.path);
        if (inCategory && category === 'docs') {
          if (isZhCN) {
            return r.path.indexOf('-cn') >= 0;
          } else {
            return r.path.indexOf('-cn') === -1;
          }
        } else {
          return inCategory;
        }
      })
      .map(r => ({ ...r.meta, path: r.path.split(':lang')[0].replace('-cn', '') }));
    // if (category === 'docs') {
    //   ms.push({
    //     enTitle: 'Change Log',
    //     title: '更新日志',
    //     category: 'docs',
    //     target: '_blank',
    //     path: globalConfig.isZhCN.value
    //       ? 'https://github.com/vueComponent/ant-design-vue/blob/next/CHANGELOG.zh-CN.md'
    //       : 'https://github.com/vueComponent/ant-design-vue/blob/next/CHANGELOG.en-US.md',
    //   } as any);
    // }
    return ms;
  });
  const activeMenuItem = computed(() => {
    return route.path.split('-cn')[0];
  });
  const currentMenuIndex = computed(() => {
    return menus.value.findIndex(m => m.path === activeMenuItem.value);
  });
  const dataSource = computed(() => {
    const group = groupBy(menus.value, (m: any) => m.type || m.category);
    const keys: string[] = Object.keys(group);
    const newMenus = keys
      .map(key => {
        return {
          title: key,
          order: typeOrder[key] && typeOrder[key].order,
          enTitle: typeOrder[key] && typeOrder[key].en,
          children: sortBy(group[key], 'title'),
        };
      })
      .sort((a, b) => a.order - b.order);
    return keys.length === 1 ? menus.value : newMenus;
  });
  return { menus, dataSource, activeMenuItem, currentMenuIndex };
};

export default useMenus;
