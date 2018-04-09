
# Ant Design of Vue

Following the Ant Design specification, we developed a Vue UI library `antd` that contains a set of high quality components and demos for building rich, interactive user interfaces.

<div class="pic-plus">
  <img width="150" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">
  <span>+</span>
  <img width="160" src="https://cn.vuejs.org/images/logo.png">
</div>


<style>
.pic-plus > * {
  display: inline-block !important;
  vertical-align: middle;
}
.pic-plus span {
  font-size: 30px;
  color: #aaa;
  margin: 0 20px;
}
</style>


## Features

- An enterprise-class UI design language for web applications.
- A set of high-quality React components out of the box.
- Shared [Ant Design of React](https://ant.design/docs/spec/introduce) design resources.

## Environment Support

* Modern browsers and Internet Explorer 9+ (with [polyfills](https://vuecomponent.github.io/ant-design/docs/react/getting-started-cn#兼容性))
* Server-side Rendering

## Version

- Stable: [![npm package](https://img.shields.io/npm/v/vue-antd-ui.svg?style=flat-square)](https://www.npmjs.org/package/vue-antd-ui)

You can subscribe to this feed for new version notifications: https://github.com/vueComponent/ant-design/releases.atom

## Installation

### Using npm or yarn

**We recommend using npm or yarn to install**，it not only makes development easier，but also allow you to take advantage of the rich ecosystem of Javascript packages and tooling.

```bash
$ npm install vue-antd-ui --save
```

```bash
$ yarn add vue-antd-ui
```

If you are in a bad network environment，you can try other registries and tools like [cnpm](https://github.com/cnpm/cnpm).

### Import in Browser

Add `script` and `link` tags in your browser and use the global variable `antd`.

We provide `antd.js` `antd.css` and `antd.min.js` `antd.min.css` under `vue-antd-ui/dist` in antd's npm package. You can also download these files directly from [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/vue-antd-ui/badge)](https://www.jsdelivr.com/package/npm/vue-antd-ui) or [unpkg](https://unpkg.com/vue-antd-ui/dist/).

> **We strongly discourage loading the entire files** this will add bloat to your application and make it more difficult to receive bugfixes and updates. Antd is intended to be used in conjunction with a build tool, such as [webpack](https://webpack.github.io/), which will make it easy to import only the parts of antd that you are using.

> Note: you should import moment before using antd.js.

## Usage

```jsx
import Vue from 'vue'
import { DatePicker } from 'vue-antd-ui';
Vue.component(DatePicker.name, DatePicker)
```

And import stylesheets manually:

```jsx
import 'vue-antd-ui/dist/antd.css';  // or 'vue-antd-ui/dist/antd.less'
```

### Use modularized antd

- Use [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) (Recommended)

   ```js
   // .babelrc or babel-loader option
   {
     "plugins": [
       ["import", { "libraryName": "vue-antd-ui", "libraryDirectory": "es", "style": "css" }] // `style: true` for less
     ]
   }
   ```

   > Note: Don't set `libraryDirectory` if you are using webpack 1.

   This allows you to import components from antd without having to manually import the corresponding stylesheet. The antd babel plugin will automatically import stylesheets.

   ```jsx
   // import js and css modularly, parsed by babel-plugin-import
   import { DatePicker } from 'vue-antd-ui';
   ```

- Manually import

   ```jsx
   import DatePicker from 'vue-antd-ui/lib/date-picker';  // for js
   import 'vue-antd-ui/lib/date-picker/style/css';        // for css
   // import 'vue-antd-ui/lib/date-picker/style';         // that will import less
   ```


## Links

- [Home Page](https://vuecomponent.github.io/ant-design/)
- [Ant Design React](https://ant.design/)
- [Components](https://vuecomponent.github.io/ant-design/docs/react/introduce)
- [Change Log](/ant-design/changelog)
- [CodeSandbox template](https://codesandbox.io/s/2wpk21kzvr) for bug reports
- [Customize Theme](/ant-design/docs/vue/customize-theme)



## Contributing


If you'd like to help us improve antd, just create a [Pull Request](https://github.com/vueComponent/ant-design/pulls). Feel free to report bugs and issues [here](https://github.com/vueComponent/ant-design/issues).

> If you're new to posting issues, we ask that you read [*How To Ask Questions The Smart Way*](http://www.catb.org/~esr/faqs/smart-questions.html) and [How to Ask a Question in Open Source Community](https://github.com/seajs/seajs/issues/545) and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html) prior to posting. Well written bug reports help us help you!

