// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import Vue, { VNodeProps, App } from 'vue';

export declare class AntdComponent<T> {
  $props: VNodeProps & T;
  static install(App: App): void;
}
