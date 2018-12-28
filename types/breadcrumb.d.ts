import Vue, { VNode } from 'vue';

import { AntdVueComponent } from './component';

export interface RenderOptions{
  route: object[]

  params: object

  routes: object

  paths: string
}

/** ABreadcrumb Layout Component */
export declare class ABreadcrumb extends AntdVueComponent {
  itemRender (options: RenderOptions): VNode

  params: object

  routes: object[]

  separator: string | VNode
}

export declare class ABreadcrumbItem extends AntdVueComponent {

}

