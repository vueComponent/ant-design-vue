# Getting Started

Ant Design Vue is dedicated to providing a **good development experience** for programmers. Make sure that you had installed [Node.js](https://nodejs.org/)(> v8.9) correctly.

> Before delving into Ant Design Vue, a good knowledge base of [Vue](https://www.vuejs.org/) and [JavaScript ES2015](http://babeljs.io/docs/learn-es2015/) is needed.

## Playground

The following CodeSandbox demo is the simplest use case, and it's also a good habit to fork this demo to provide a re-producible demo while reporting a bug.

- [![Vue Antd Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/agitated-franklin-1w72v)

## Import ant-design-vue

### 1. Create a New Project

If you need to create a new project, you can use [Vite](https://github.com/vitejs/vite), [Rsbuild](https://github.com/web-infra-dev/rsbuild), or [Vue CLI](https://github.com/vuejs/vue-cli).

Please initialize the project using the command line:

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

> Vue CLI is no longer maintained, so it is not recommended to use.

### 2. Use antd's Components

#### Install

```bash
$ npm i --save ant-design-vue@4.x
```

#### Component Registration

If you use Vue's default template syntax, you need to register components before you can use them. There are three ways to register components:

**Global Registration All Components**

```jsx
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Antd).mount('#app');
```

The above imports Antd entirely. Note that CSS file needs to be imported separately.

**Global Registration Some Components**

```jsx
import { createApp } from 'vue';
import { Button, message } from 'ant-design-vue';
import App from './App';

const app = createApp(App);

/* Automatically register components under Button, such as Button.Group */
app.use(Button).mount('#app');

app.config.globalProperties.$message = message;
```

**Local Registration**

In this way, component sub-components, such as Button and ButtonGroup, need to be registered separately, and they are only valid in the current component after registration. Therefore, we recommend using the above two methods.

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

### 3. Component list

[Component list](https://github.com/vueComponent/ant-design-vue/blob/main/components/components.ts)

## Import on Demand

`ant-design-vue` supports tree shaking of ES modules, so using `import { Button } from 'ant-design-vue';` would drop js code you didn't use.

## Customization

- [Customize Theme](/docs/vue/customize-theme)
