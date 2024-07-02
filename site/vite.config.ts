import path from 'path';
import vue from '@vitejs/plugin-vue';
import md from '../plugin/md';
import docs from '../plugin/docs';
import vueJsx from '@vitejs/plugin-vue-jsx';
/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      vue:
        process.env.NODE_ENV === 'production'
          ? 'vue/dist/vue.runtime.esm-browser.prod.js'
          : 'vue/dist/vue.esm-bundler.js',
      'ant-design-vue/es': path.resolve(__dirname, '../components'),
      'ant-design-vue': path.resolve(__dirname, '../components'),
      '@': path.resolve(__dirname, './src'),
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
        javascriptEnabled: true,
        // includePaths: ["node_modules/"],
      },
    },
  },
};
