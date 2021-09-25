# Getting Started

Ant Design Vue is dedicated to providing a **good development experience** for programmers. Make sure that you had installed [Node.js](https://nodejs.org/)(> v8.9) correctly.

> Before delving into Ant Design Vue, a good knowledge base of [Vue](https://cn.vuejs.org/) and [JavaScript ES2015](http://babeljs.io/docs/learn-es2015/) is needed.

## Playground

The following CodeSandbox demo is the simplest use case, and it's also a good habit to fork this demo to provide a re-producible demo while reporting a bug.

- [![Vue Antd Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/agitated-franklin-1w72v)

## Import ant-design-vue

### 1. Installation

[vue-cli](https://github.com/vuejs/vue-cli)

```bash
$ npm install -g @vue/cli
# OR
$ yarn global add @vue/cli
```

### 2. Create a New Project

A new project can be created using CLI tools.

```bash
$ vue create antd-demo
```

And, setup your vue project configuration.

### 3. Use antd's Components

```bash
$ npm i --save ant-design-vue@next
```

**Fully import**

```jsx
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

const app = createApp();
app.config.productionTip = false;

app.use(Antd);
```

The above imports Antd entirely. Note that CSS file needs to be imported separately.

**Only import the components you need**

```jsx
import { createApp } from 'vue';
import { Button, message } from 'ant-design-vue';
import App from './App';

const app = createApp(App);
app.config.productionTip = false;

/* Automatically register components under Button, such as Button.Group */
app.use(Button).mount('#app');

app.config.globalProperties.$message = message;
```

> All the components in antd are listed in the sidebar.

### 4. Component list

[Component list](https://github.com/vueComponent/ant-design-vue/blob/next/components/components.ts)

## Compatibility

Ant Design Vue 2.x supports all the modern browsers. If you want to use IE9+, you can use Ant Design Vue 1.x & Vue 2.x.

You need to provide [es5-shim](https://github.com/es-shims/es5-shim) and [es6-shim](https://github.com/paulmillr/es6-shim) and other polyfills for IE browsers.

If you are using babel, we strongly recommend using [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) and [babel-plugin-transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/) instead of those two shims.

> Please avoid using both the babel and shim methods at the same time.

## Import on Demand

we can import individual components on demand:

```jsx
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/lib/button/style'; // or ant-design-vue/lib/button/style/css for css format file
```

We strongly recommend using [babel-plugin-import](https://github.com/ant-design/babel-plugin-import), which can convert the following code to the 'ant-design-vue/lib/xxx' way:

```jsx
import { Button } from 'ant-design-vue';
```

And this plugin can load styles too, read [usage](https://github.com/ant-design/babel-plugin-import#usage) for more details.

> FYI, babel-plugin-import's `style` option will importing some global reset styles, don't use it if you don't need those styles. You can import styles manually via `import 'ant-design-vue/dist/antd.css'` and override the global reset styles.

If you use Vite, you can use [vite-plugin-components](https://github.com/antfu/vite-plugin-components) to load on demand.

## Customization

- [Customize Theme](/docs/vue/customize-theme)

## Tips

- You can use any `npm` modules.
