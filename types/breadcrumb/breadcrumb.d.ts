// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from '../component';
import { VNode } from 'vue';
import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbSeparator } from './breadcrumb-separator';

export interface Route {
  path?: String;
  breadcrumbName?: String;
}

export declare class Breadcrumb extends AntdComponent {
  static Item: typeof BreadcrumbItem;
  static Separator: typeof BreadcrumbSeparator;
  /**
   * The routing stack information of router
   * @type Route[]
   */
  routes: Route[];

  /**
   * Routing parameters
   * @type object
   */
  params: object;

  /**
   * Custom separator
   * @default '/'
   * @type any (string | slot)
   */
  separator: any;

  /**
   * Custom item renderer, slot="itemRender" and slot-scope="{route, params, routes, paths}"
   * @type Function
   */
  itemRender: ({
    route,
    params,
    routes,
    paths,
  }: {
    route: any;
    params: any;
    routes: any;
    paths: any;
  }) => VNode;
}
