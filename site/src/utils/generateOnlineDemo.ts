import { getParameters } from 'codesandbox/lib/api/define';
import packageInfo from '../../../package.json';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Ant Design Vue Demo</title>
    <style>
      body {
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

const appVue = `<template>
<Demo />
</template>

<script>
import { defineComponent } from "vue";
import Demo from "./demo.vue";

export default defineComponent({
components: {
  Demo,
},
});
</script>`;

const mainJs = `import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Antd).mount('#app');
`;

function getDeps(code: string) {
  return (code.match(/from '([^']+)';\n/g) || [])
    .map(v => v.slice(6, v.length - 3))
    .reduce((prevV, dep) => {
      prevV[dep] = 'latest';
      return prevV;
    }, {});
}

type Meta = {
  title: string;
};

// codeSandbox
export function getCodeSandboxParams(code: string, meta: Meta): string {
  return getParameters({
    files: {
      'package.json': {
        content: JSON.stringify({
          title: meta.title,
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vue-tsc --noEmit && vite build',
            preview: 'vite preview',
          },
          dependencies: {
            ...getDeps(code),
            vue: packageInfo.dependencies.vue,
            'ant-design-vue': packageInfo.version,
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^3.0.3',
            less: '^4.1.3',
            typescript: '^4.6.4',
            vite: '^3.0.7',
            'vue-tsc': '^0.39.5',
          },
        }),
        isBinary: false,
      },
      'vite.config.ts': {
        content: `
        import { defineConfig } from "vite";
        import vue from "@vitejs/plugin-vue";
        
        // https://vitejs.dev/config/
        export default defineConfig({
          plugins: [vue()],
          css: {
            preprocessorOptions: {
              less: {
                javascriptEnabled: true,
              },
            },
          },
        });        
        `,
        isBinary: false,
      },
      'index.html': {
        content: indexHtml,
        isBinary: false,
      },
      'src/demo.vue': {
        content: code,
        isBinary: false,
      },
      'src/App.vue': {
        content: appVue,
        isBinary: false,
      },
      'src/main.js': {
        content: mainJs,
        isBinary: false,
      },
    },
  });
}
