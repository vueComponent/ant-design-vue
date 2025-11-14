import { defineConfig } from "eslint/config";
import { parserVue, pluginVue } from "../plugins";

export const vue = defineConfig([
  {
    name: '@ant-design-vue/vue',
    files: ['**/*.vue'],
    extends: [
      ...pluginVue.configs['flat/recommended'],
    ],
    rules: {
      'vue/require-default-prop': 'off',
      'vue/no-mutating-props': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      semi: ['error', 'always'],
      quotes: [
        2,
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      'vue/require-prop-types': 0,
      'vue/v-on-event-hyphenation': 0,
    }
  },
  {
    name: '@ant-design-vue/vue/setup',
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
])
