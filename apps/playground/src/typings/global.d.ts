/* eslint-disable @typescript-eslint/consistent-type-imports */
declare module 'vue' {
  export interface GlobalComponents {
    AButton: typeof import('ant-design-vue').Button
  }
}
export {}
