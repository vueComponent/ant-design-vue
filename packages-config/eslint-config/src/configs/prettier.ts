import { configPrettier } from "../plugins";
import { defineConfig } from 'eslint/config';

export const prettier = defineConfig({
  name: '@ant-design-vue/prettier',
  ...configPrettier,
})
