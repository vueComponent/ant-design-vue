# 在 vue-cli 3 中使用

[vue-cli](https://github.com/vuejs/vue-cli) 是业界最优秀的 Vue 应用开发工具之一，本文会尝试在 vue-cli 创建的工程中使用 antd 组件，并自定义 webpack 的配置以满足各类工程化需求。

## 安装和初始化

我们需要在命令行中安装 vue-cli 工具，你可能还需要安装 [yarn](https://github.com/yarnpkg/yarn/)。

```bash
$ npm install -g @vue/cli
# OR
$ yarn global add @vue/cli
```

然后新建一个项目。

```bash
$ vue create antd-demo
```

并配置项目。

工具会自动初始化一个脚手架并安装 Vue 项目的各种必要依赖，如果在过程中出现网络问题，请尝试配置代理或使用其他 npm registry。

然后我们进入项目并启动。

```bash
$ cd antd-demo
$ npm run serve
```

此时浏览器会访问 http://localhost:8080/ ，看到 `Welcome to Your Vue.js App` 的界面就算成功了。

## 引入 antd

这是 vue-cli 生成的默认目录结构。

```null
├── README.md
├── babel.config
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── App.vue
│   └── main.js
└── yarn.lock
```

现在从 yarn 或 npm 安装并引入 ant-design-vue。

```bash
$ yarn add ant-design-vue
```

修改 `src/main.js`，引入 antd 的按钮组件以及全部样式文件。

```jsx
import Vue from 'vue';
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/dist/antd.css';
import App from './App';

const app = createApp(App);
app.config.productionTip = false;

/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Button).mount('#app');
```

修改 `src/App.vue`的 template 内容。

```jsx
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <a-button type="primary">Button></a-button>
  </div>
</template>
...
```

好了，现在你应该能看到页面上已经有了 antd 的蓝色按钮组件，接下来就可以继续选用其他组件开发应用了。其他开发流程你可以参考 vue-cli 的[官方文档](https://github.com/vuejs/vue-cli/blob/master/README.md)。

## 高级配置

我们现在已经把组件成功运行起来了，但是在实际开发过程中还有很多问题，例如上面的例子实际上加载了全部的 antd 组件的样式（对前端性能是个隐患）。

此时我们需要对 vue-cli 的默认配置进行自定义。

### 使用 babel-plugin-import

[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一个用于按需加载组件代码和样式的 babel 插件（[原理](/docs/vue/getting-started-cn/#按需加载)）。

```bash
$ yarn add babel-plugin-import --dev
```

#### 使用 vue-cli 2 的小伙伴

修改`.babelrc`文件，配置 babel-plugin-import

```diff
  {
    "presets": [
      ["env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "stage-2"
    ],
-   "plugins": ["transform-vue-jsx", "transform-runtime"]
+   "plugins": [
+     "transform-vue-jsx",
+     "transform-runtime",
+     ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }]
+   ]
  }
```

#### 使用 vue-cli 3 的小伙伴

修改`babel.config.js`文件，配置 babel-plugin-import

```diff
 module.exports = {
  presets: ["@vue/app"],
+  plugins: [
+    [
+      "import",
+      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
+    ]
+  ]
};
```

然后移除前面在 `src/main.js` 里全量添加的 `import 'ant-design-vue/dist/antd.css';` 样式代码，并且按下面的格式引入模块。

```diff
  // src/main.js
  import Vue from 'vue'
- import Button from 'ant-design-vue/lib/button';
+ import { Button } from 'ant-design-vue';
- import 'ant-design-vue/dist/antd.css'
  import App from './App'

  Vue.component(Button.name, Button)

  Vue.config.productionTip = false

  new Vue({
    render: h => h(App)
  }).$mount("#app");
```

最后重启 `npm run serve` 访问页面，antd 组件的 js 和 css 代码都会按需加载，你在控制台也不会看到这样的[警告信息](https://zos.alipayobjects.com/rmsportal/vgcHJRVZFmPjAawwVoXK.png)。关于按需加载的原理和其他方式可以阅读[这里](/docs/vue/getting-started-cn/#按需加载)。

### 自定义主题

按照 [配置主题](/docs/vue/customize-theme-cn) 的要求，自定义主题需要用到 less 变量覆盖功能。
