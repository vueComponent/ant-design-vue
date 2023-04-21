# Ant Design of Vue

这里是 Ant Design 的 Vue 实现，开发和服务于企业级后台产品。

<div class="pic-plus">
  <img width="150" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <span>+</span>
  <img width="160" src="https://qn.antdv.com/vue.png" />
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

- 现代浏览器, 如果需要支持 IE9，你可以选择使用 [1.x 版本](https://1x.antdv.com/)。
- 支持服务端渲染。
- [Electron](https://electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Electron |
| --- | --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 版本

- 稳定版：[![npm package](https://img.shields.io/npm/v/ant-design-vue.svg?style=flat-square)](https://www.npmjs.org/package/ant-design-vue)

你可以订阅：https://github.com/vueComponent/ant-design-vue/releases.atom 来获得稳定版发布的通知。

## 安装

### 使用 npm 或 yarn 安装

**我们推荐使用 npm 或 yarn 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

```bash
$ npm install ant-design-vue@4.x --save
```

```bash
$ yarn add ant-design-vue@4.x
```

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antd`。

我们在 npm 发布包内的 `ant-design-vue/dist` 目录下提供了 `antd.js`、`antd.min.js` 和 `reset.css`。你也可以通过 [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/ant-design-vue/badge)](https://www.jsdelivr.com/package/npm/ant-design-vue) 或 [UNPKG](https://unpkg.com/ant-design-vue/dist/) 进行下载。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：引入 `antd.js` 前你需要自行引入 `vue`、[`dayjs`](https://day.js.org/) 及其相关插件。

如：

```html
<script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
<script src="https://unpkg.com/dayjs/plugin/customParseFormat.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekday.js"></script>
<script src="https://unpkg.com/dayjs/plugin/localeData.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekOfYear.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekYear.js"></script>
<script src="https://unpkg.com/dayjs/plugin/advancedFormat.js"></script>
<script src="https://unpkg.com/dayjs/plugin/quarterOfYear.js"></script>
```

## 示例

```jsx
import { DatePicker } from 'ant-design-vue';
app.use(DatePicker);
```

引入样式：

```jsx
import 'ant-design-vue/dist/reset.css';
```

### 按需加载

`ant-design-vue` 默认支持基于 ES modules 的 tree shaking。

## 链接

- [首页](https://www.antdv.com/)
- [Ant Design Of React](https://ant.design/)
- [组件库](https://www.antdv.com/components/overview-cn)
- [更新日志](/docs/vue/changelog-cn)
- [CodeSandbox 模板](https://codesandbox.io/s/agitated-franklin-1w72v) for bug reports
- [定制主题](/docs/vue/customize-theme-cn)
- [常见问题](/docs/vue/faq-cn)
- [支持我们](/docs/vue/sponsor-cn)
- [Awesome Ant Design](https://github.com/vueComponent/ant-design-vue-awesome)

## 如何贡献

如果你希望参与贡献，欢迎 [Pull Request](https://github.com/vueComponent/ant-design-vue/pulls)，或给我们 [报告 Bug](https://vuecomponent.github.io/issue-helper/)([国内镜像](http://ant-design-vue.gitee.io/issue-helper/))。

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

## 关于 ant-design-vue

众所周知，Ant Design 作为一门设计语言面世，经历过多年的迭代和积累，它对 UI 的设计思想已经成为一套事实标准，受到众多前端开发者及企业的追捧和喜爱，也是 React 开发者手中的神兵利器。希望 ant-design-vue 能够让 Vue 开发者也享受到 Ant Design 的优秀设计。

ant-design-vue 是 Ant Design 的 Vue 实现，组件的风格与 Ant Design 保持同步，组件的 html 结构和 css 样式也保持一致，真正做到了样式 0 修改，组件 API 也尽量保持了一致。

Ant Design Vue 致力于提供给程序员**愉悦**的开发体验。

## 特别感谢

[Ant Design Team](https://github.com/ant-design/ant-design/blob/master/AUTHORS.txt)
