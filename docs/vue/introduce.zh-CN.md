
# Ant Design of Vue

这里是 Ant Design 3.X 的 Vue 实现，开发和服务于企业级后台产品。

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


## 特性

- 提炼自企业级中后台产品的交互语言和视觉风格。
- 开箱即用的高质量 Vue 组件。
- 共享[Ant Design of React](http://ant-design.gitee.io/docs/spec/introduce-cn)设计工具体系。

## 支持环境

* 现代浏览器和 IE9 及以上（需要 [polyfills](https://vuecomponent.github.io/ant-design/docs/vue/getting-started-cn/#兼容性)）。
* 支持服务端渲染。

## 版本

- 稳定版：[![npm package](https://img.shields.io/npm/v/vue-antd-ui.svg?style=flat-square)](https://www.npmjs.org/package/vue-antd-ui)

你可以订阅：https://github.com/vueComponent/ant-design/releases.atom 来获得稳定版发布的通知。

## 安装

### 使用 npm 或 yarn 安装

**我们推荐使用 npm 或 yarn 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

```bash
$ npm install vue-antd-ui --save
```

```bash
$ yarn add vue-antd-ui
```

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

> **组件库使用了 vue 的新特性`slot-scope`(2.5.0新增), `provide / inject`(2.2.0新增)**

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antd`。

我们在 npm 发布包内的 `vue-antd-ui/dist` 目录下提供了 `antd.js` `antd.css` 以及 `antd.min.js` `antd.min.css`。你也可以通过 [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/vue-antd-ui/badge)](https://www.jsdelivr.com/package/npm/vue-antd-ui)
 或 [UNPKG](https://unpkg.com/vue-antd-ui/dist/) 进行下载。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：引入 antd.js 前你需要自行引入 [moment](http://momentjs.com/)。

## 示例

```jsx
import Vue from 'vue'
import { DatePicker } from 'vue-antd-ui';
Vue.component(DatePicker.name, DatePicker)
```

引入样式：

```jsx
import 'vue-antd-ui/dist/antd.css';  // or 'vue-antd-ui/dist/antd.less'
```

### 按需加载

下面两种方式都可以只加载用到的组件。

- 使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)（推荐）。

   ```js
   // .babelrc or babel-loader option
   {
     "plugins": [
       ["import", { "libraryName": "vue-antd-ui", "libraryDirectory": "es", "style": "css" }] // `style: true` 会加载 less 文件
     ]
   }
   ```

   > 注意：webpack 1 无需设置 `libraryDirectory`。

   然后只需从 vue-antd-ui 引入模块即可，无需单独引入样式。等同于下面手动引入的方式。

   ```jsx
   // babel-plugin-import 会帮助你加载 JS 和 CSS
   import { DatePicker } from 'vue-antd-ui';
   ```

- 手动引入

   ```jsx
   import DatePicker from 'vue-antd-ui/lib/date-picker';  // 加载 JS
   import 'vue-antd-ui/lib/date-picker/style/css';        // 加载 CSS
   // import 'vue-antd-ui/lib/date-picker/style';         // 加载 LESS
   ```

## 链接

- [首页](https://vuecomponent.github.io/ant-design/)
- [Ant Design React](https://ant.design/)
- [组件库](https://vuecomponent.github.io/ant-design/docs/vue/introduce-cn)
- [更新日志](/ant-design/changelog-cn)
- [CodeSandbox 模板](https://codesandbox.io/s/2wpk21kzvr) for bug reports
- [定制主题](/ant-design/docs/vue/customize-theme-cn)


## 如何贡献

如果你希望参与贡献，欢迎 [Pull Request](https://github.com/vueComponent/ant-design/pulls)，或给我们 [报告 Bug](https://github.com/vueComponent/ant-design/issues)。

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

## 关于vue-antd-ui

众所周知，Ant Design作为一门设计语言面世，经历过多年的迭代和积累，它对UI的设计思想已经成为一套事实标准，受到众多前端开发者及企业的追捧和喜爱，也是React开发者手中的神兵利器。希望vue-antd-ui能够让Vue开发者也享受到Ant Design的优秀设计。

vue-antd-ui是Ant Design 3.X的Vue实现，该组件库目前以实现Ant Design React版80%以上的组件，组件的风格与Ant Design 3.4.0版本保持同步，组件的html结构和css样式也保持一致，真正做到了样式0修改，组件API也尽量保持了一致。

Ant Design Vue 致力于提供给程序员**愉悦**的开发体验。

## 特别感谢

[Ant Design Team](https://github.com/ant-design/ant-design/blob/master/AUTHORS.txt)

