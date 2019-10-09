// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import { AntdComponent } from './component';

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}
export interface Locale {
  locale: string;
  Pagination?: Object;
  DatePicker?: Object;
  TimePicker?: Object;
  Calendar?: Object;
  Table?: Object;
  Modal?: ModalLocale;
  Popconfirm?: Object;
  Transfer?: Object;
  Select?: Object;
  Upload?: Object;
}

export declare class LocaleProvider extends AntdComponent {
  /**
   * language package setting, you can find the packages in this path: antd/lib/locale-provider/
   * @type object
   */
  locale: object;
}
