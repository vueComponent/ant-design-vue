declare module 'omit.js';

declare module '*.json' {
  const value: any;
  export const version: string;
  export default value;
}
