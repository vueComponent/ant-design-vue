# Use in vue-cli 3

[vue-cli](https://github.com/vuejs/vue-cli) is one of the best Vue application development tools. We are going to use `antd` within it and modify the webpack config for some customized needs.

## Install and Initialization

We need to install `vue-cli` first, you may need install [yarn](https://github.com/yarnpkg/yarn/) too.

```bash
$ npm install -g @vue/cli
# OR
$ yarn global add @vue/cli
```

Create a new project named `antd-demo`.

```bash
$ vue create antd-demo
```

And, setup your vue project configuration.

The tool will create and initialize environment and dependencies automatically, please try config your proxy setting or use another npm registry if any network errors happen during it.

Then we go inside `antd-demo` and start it.

```bash
$ cd antd-demo
$ npm run serve
```

Open the browser at http://localhost:8080/. It renders a header saying "Welcome to Your Vue.js App" on the page.

## Import antd

Below is the default directory structure.

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

Now we install `ant-design-vue` from yarn or npm.

```bash
$ yarn add ant-design-vue
```

Modify `src/main.js`, import Button component from `antd`.

```jsx
import Vue from 'vue';
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/dist/reset.css';
import App from './App';

const app = createApp(App);

/* Automatically register components under Button, such as Button.Group */
app.use(Button).mount('#app');
```

Modify `src/App.vue`。

```jsx
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <a-button type="primary">Button></a-button>
    <router-view/>
  </div>
</template>
...
```

Ok, you should now see a blue primary button displayed on the page. Next you can choose any components of `antd` to develop your application. Visit other workflows of `vue-cli` at its [User Guide ](https://github.com/vuejs/vue-cli/blob/master/README.md).
