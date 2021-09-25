# 快速上手

Ant Design Vue 致力于提供给程序员**愉悦**的开发体验。

> 在开始之前，推荐先学习 [Vue](https://cn.vuejs.org/) 和 [ES2015](http://babeljs.io/docs/learn-es2015/)，并正确安装和配置了 [Node.js](https://nodejs.org/) v8.9 或以上。官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识，并且已经完全掌握了 Vue 的正确开发方式。如果你刚开始学习前端或者 Vue，将 UI 框架作为你的第一步可能不是最好的主意。

## 在线演示

最简单的使用方式参照以下 CodeSandbox 演示，也推荐 Fork 本例来进行 `Bug Report`。

- [![Vue Antd Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/agitated-franklin-1w72v)

## 引入 ant-design-vue

### 1. 安装脚手架工具

[vue-cli](https://github.com/vuejs/vue-cli)

```bash
$ npm install -g @vue/cli
# OR
$ yarn global add @vue/cli
```

### 2. 创建一个项目

使用命令行进行初始化。

```bash
$ vue create antd-demo
```

并配置项目。

若安装缓慢报错，可尝试用 `cnpm` 或别的镜像源自行安装：`rm -rf node_modules && cnpm install`。

### 3. 使用组件

```bash
$ npm i --save ant-design-vue@next
```

**完整引入**

```jsx
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

const app = createApp();
app.config.productionTip = false;

app.use(Antd);
```

以上代码便完成了 Antd 的引入。需要注意的是，样式文件需要单独引入。

**局部导入组件**

```jsx
import { createApp } from 'vue';
import { Button, message } from 'ant-design-vue';
import App from './App';

const app = createApp(App);
app.config.productionTip = false;

/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Button).mount('#app');

app.config.globalProperties.$message = message;
```

> 你可以在左侧菜单选用更多组件。

## 兼容性

Ant Design Vue 2.x 支持所有的现代浏览器。

如果需要支持 IE9+，你可以使用 Ant Design Vue 1.x & Vue 2.x。

对于 IE 系列浏览器，需要提供 [es5-shim](https://github.com/es-shims/es5-shim) 和 [es6-shim](https://github.com/paulmillr/es6-shim) 等 Polyfills 的支持。

如果你使用了 babel，强烈推荐使用 [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) 和 [babel-plugin-transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) 来替代以上两个 shim。

> 避免同时使用 babel 和 shim 两种兼容方法，以规避 [#6512](https://github.com/ant-design/ant-design/issues/6512) 中所遇问题

## 按需加载

如果你仅需要加载使用的组件，可以通过以下的写法来按需加载组件。

```jsx
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/lib/button/style'; // 或者 ant-design-vue/lib/button/style/css 加载 css 文件
```

如果你使用了 babel，那么可以使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 来进行按需加载，加入这个插件后。你可以仍然这么写：

```jsx
import { Button } from 'ant-design-vue';
```

插件会帮你转换成 `ant-design-vue/lib/xxx` 的写法。另外此插件配合 [style](https://github.com/ant-design/babel-plugin-import#usage) 属性可以做到模块样式的按需自动加载。

> 注意，babel-plugin-import 的 `style` 属性除了引入对应组件的样式，也会引入一些必要的全局样式。如果你不需要它们，建议不要使用此属性。你可以 `import 'ant-design-vue/dist/antd.css` 手动引入，并覆盖全局样式。

如果你使用的 Vite，你可以使用 [vite-plugin-components](https://github.com/antfu/vite-plugin-components) 来进行按需加载

## 配置主题和字体

- [改变主题](/docs/vue/customize-theme-cn)

## 小贴士

- 你可以享用 `npm` 生态圈里的所有模块。
- 虽然 Vue 官方推荐模板编写组件，不过对于复杂组件，[jsx](https://github.com/vueComponent/jsx)未必不是一个更好的选择。
