import { VNodeChild } from 'vue';
import { AntdComponent, AntdProps } from './component';

export declare class Result extends AntdComponent {
  $props: AntdProps & {
    /**
     * result title
     * @type string
     */
    title?: VNodeChild | JSX.Element;

    /**
     * result sub title
     *
     * @type string
     */
    subTitle?: VNodeChild | JSX.Element;

    /**
     * result status,decide icons and colors
     * enum of 'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500'` | 'info'
     *
     * @default 'info'
     * @type string
     */
    status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

    /**
     * custom back icon
     * @type any v-slot
     */
    icon?: VNodeChild | JSX.Element;

    /**
     * 	operating area
     * 	@type any v-slot
     */
    extra?: VNodeChild | JSX.Element;
  };
}
