// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types
import { AntdComponent, AntdProps } from '../component';
export declare class BreadcrumbItem extends AntdComponent {
  $props: AntdProps & {
    /**
     * add navigation
     * @default ''
     * @type string
     */
    href?: string;
    overlay?: any;
  };
}
