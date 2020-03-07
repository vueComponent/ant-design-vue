import { AntdComponent } from './component';

export declare class Result extends AntdComponent {
  /**
   * result title
   * @type string
   */
  title: any;

  /**
   * result sub title
   *
   * @type string
   */
  subTitle: any;

  /**
   * result status,decide icons and colors
   * enum of 'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500'` | 'info'
   *
   * @default 'info'
   * @type string
   */
  status: string;

  /**
   * custom back icon
   * @type any v-slot
   */
  icon: any;

  /**
   * 	operating area
   * 	@type any v-slot
   */
  extra: any;
}
