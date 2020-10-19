declare module '@ant-design/css-animation*';
declare module 'component-classes';
declare module '*.vue';
declare module '*.md';
declare module '*vc-*';
declare module 'omit.js';

declare module '*.json' {
  const value: any;
  export const version: string;
  export default value;
}
