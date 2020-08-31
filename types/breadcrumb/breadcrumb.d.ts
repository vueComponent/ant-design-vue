// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { VNode } from 'vue';
import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbSeparator } from './breadcrumb-separator';
import { AntdComponent, AntdProps } from '../component';

export interface Route {
  path?: String;
  breadcrumbName?: String;
  children?: Route[];
}

export declare class Breadcrumb extends AntdComponent {
  static Item: typeof BreadcrumbItem;
  static Separator: typeof BreadcrumbSeparator;

  $props: AntdProps & {
    /**
     * The routing stack information of router
     * @type Route[]
     */
    routes?: Route[];

    /**
     * Routing parameters
     * @type object
     */
    params?: object;

    /**
     * Custom separator
     * @default '/'
     * @type any (string | slot)
     */
    separator?: string | VNode | VNode[];

    /**
     * Custom item renderer, slot="itemRender" and slot-scope="{route, params, routes, paths}"
     * @type Function
     */
    itemRender?: ({
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
  };
}
