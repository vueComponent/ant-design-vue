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
  const deps = Object.assign({}, packageInfo.dependencies, packageInfo.devDependencies);
  return (code.match(/from '([^']+)';\n/g) || [])
    .map(v => v.slice(6, v.length - 3))
    .reduce((prevV, dep) => {
      prevV[dep] = deps[dep] || 'latest';
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
        content: JSON.stringify(
          {
            title: meta.title,
            dependencies: {
              ...getDeps(code),
              vue: packageInfo.peerDependencies.vue,
              'ant-design-vue': packageInfo.version,
            },
            devDependencies: {
              '@vue/cli-plugin-babel': '~4.5.0',
              typescript: '^4.0.5',
            },
            browserslist: ['> 0.2%', 'not dead'],
          },
          undefined,
          2,
        ),
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
