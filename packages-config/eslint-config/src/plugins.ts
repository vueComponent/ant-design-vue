//@ts-nocheck
import jseslint from "@eslint/js";
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import pluginCheckFile from 'eslint-plugin-check-file'

import configPrettier from 'eslint-config-prettier'
import parserVue from 'vue-eslint-parser'

export {
  jseslint,
  tseslint,
  pluginCheckFile,
  pluginUnusedImports,
  pluginVue,
  configPrettier,
  parserVue
}
