import path from 'path';
import vue from '@vitejs/plugin-vue';
import md from '../plugin/md';
import docs from '../plugin/docs';
import vueJsx from '@vitejs/plugin-vue-jsx';
// import { getThemeVariables } from 'ant-design-vue/dist/theme';
// import { additionalData } from './themeConfig';
import defaultVar from '../scripts/default-vars';
// import compact from '../scripts/compact-vars';
// import dark from '../scripts/dark-vars';
/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      // moment: 'moment/dist/moment.js',
      '@': path.join(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js',
      'ant-design-vue': path.resolve(__dirname, '../components'),
    },
  },
  plugins: [
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    docs(),
    md(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ],
  optimizeDeps: {
    include: ['fetch-jsonp', '@ant-design/icons-vue', 'lodash-es'],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: { ...defaultVar },
        javascriptEnabled: true,
        // includePaths: ["node_modules/"],
        // additionalData,
      },
    },
  },
};
