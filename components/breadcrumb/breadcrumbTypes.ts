import { VNodeChild, HTMLAttributes, VNode } from 'vue';
import { Menu } from 'types/menu/menu';

export type VNodeElement = VNodeChild | JSX.Element;

export interface RouteItem {
  path: string;
  breadcrumbName: string;
  children?: RouteItem[];
}

export interface ItemRenderParams {
  route: RouteItem;
  params?: any;
  routes: RouteItem[];
  paths: string[];
}

export interface GenForRoutesParams {
  routes: RouteItem[];
  params: any;
  separator: VNodeElement;
  itemRender?: (opt: ItemRenderParams) => void;
}

export interface BreadcrumbProps extends HTMLAttributes {
  prefixCls?: string;
  routes?: RouteItem[];
  params?: any;
  separator?: VNodeElement;
  itemRender?: (opt: ItemRenderParams) => VNode;
}

export interface BreadcrumbItemProps extends HTMLAttributes {
  prefixCls?: string;
  href?: string;
  separator?: VNodeElement;
  overlay?: Menu | (() => Menu);
}
