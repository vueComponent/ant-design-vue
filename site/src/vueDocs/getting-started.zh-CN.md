# 快速上手

Ant Design Vue 致力于提供给程序员**愉悦**的开发体验。

> 在开始之前，推荐先学习 [Vue](https://www.vuejs.org/) 和 [ES2015](http://babeljs.io/docs/learn-es2015/)，并正确安装和配置了 [Node.js](https://nodejs.org/) v8.9 或以上。官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识，并且已经完全掌握了 Vue 的正确开发方式。如果你刚开始学习前端或者 Vue，将 UI 框架作为你的第一步可能不是最好的主意。

## 在线演示

最简单的使用方式参照以下 CodeSandbox 演示，也推荐 Fork 本例来进行 `Bug Report`。

- [![Vue Antd Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/agitated-franklin-1w72v)

## 引入 ant-design-vue

### 1. 新建项目

如果你需要新建一个项目，可以使用 [Vite](https://github.com/vitejs/vite)、[Rsbuild](https://github.com/web-infra-dev/rsbuild) 或 [Vue CLI](https://github.com/vuejs/vue-cli)。

请使用命令行来初始化项目：

- Vite:

```bash
$ npm create vite@latest
```

- Rsbuild:

```bash
$ npm create rsbuild@latest
```

- Vue CLI:

```bash
$ npm install -g @vue/cli
# OR
$ yarn global add @vue/cli

$ vue create antd-demo
```

> Vue CLI 已经停止迭代，因此不推荐使用。

若安装缓慢报错，可尝试用 `cnpm` 或别的镜像源自行安装：`rm -rf node_modules && cnpm install`。

### 2. 使用组件

#### 安装

```bash
$ npm i --save ant-design-vue@4.x
```

#### 注册

如果使用 Vue 默认的模板语法，需要注册组件后方可使用，有如下三种方式注册组件：

**全局完整注册**

```jsx
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Antd).mount('#app');
```

以上代码便完成了 Antd 的全局注册。需要注意的是，样式文件需要单独引入。

**全局部分注册**

```jsx
import { createApp } from 'vue';
import { Button, message } from 'ant-design-vue';
import App from './App';

const app = createApp(App);

/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Button).mount('#app');

app.config.globalProperties.$message = message;
```

**局部注册组件**

此种方式需要分别注册组件子组件，如 Button、ButtonGroup，并且注册后仅在当前组件中有效。所以我们推荐使用上述两种方式。

```html
<template>
  <a-button>Add</a-button>
</template>
<script>
  import { Button } from 'ant-design-vue';
  const ButtonGroup = Button.Group;

  export default {
    components: {
      AButton: Button,
      AButtonGroup: ButtonGroup,
    },
  };
</script>
```

## 按需加载

`ant-design-vue` 默认支持基于 ES modules 的 tree shaking，直接引入 `import { Button } from 'ant-design-vue';` 就会有按需加载的效果。

## 配置主题和字体

- [改变主题](/docs/vue/customize-theme-cn)
