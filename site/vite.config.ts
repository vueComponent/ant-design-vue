import path from 'path';
import vue from '@vitejs/plugin-vue';
import md from '../plugin/md';
import docs from '../plugin/docs';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { additionalData } from './themeConfig';
import defaultVar from '../scripts/default-vars';
/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      'ant-design-vue/es': path.resolve(__dirname, '../components'),
      'ant-design-vue': path.resolve(__dirname, '../components'),
    },
  },
  server: {
    host: true,
  },
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
      mergeProps: false,
      enableObjectSlots: false,
    }),
    docs(),
    md(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
  optimizeDeps: {
    include: [
      'fetch-jsonp',
      '@ant-design/icons-vue',
      'lodash-es',
      'dayjs',
      'vue',
      'vue-router',
      'vue-i18n',
      'async-validator',
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true;@import "${require.resolve('../components/style/color/colorPalette.less')}";`,
          ...defaultVar,
        },
        javascriptEnabled: true,
        // includePaths: ["node_modules/"],
        additionalData,
      },
    },
  },
};
