import { defineConfig } from "eslint/config";
import { tseslint } from "../plugins";

export const typescript = defineConfig([
  {
    // @ts-expect-error - xxx
    extends: [...tseslint.configs.recommended],
    name: '@ant-design-vue/typescript',
    files: ['**/*.?([cm])ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  }
])


 
