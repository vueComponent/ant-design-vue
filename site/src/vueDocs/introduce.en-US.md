# Ant Design of Vue

Following the Ant Design specification, we developed a Vue UI library `antd` that contains a set of high quality components and demos for building rich, interactive user interfaces.

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

## Features

- An enterprise-class UI design language for web applications.
- A set of high-quality Vue components out of the box.
- Shared [Ant Design of React](https://ant.design/docs/spec/introduce) design resources.

## Environment Support

- Modern browsers. You can use [1.x](https://1x.antdv.com/) for IE9+.
- Server-side Rendering
- [Electron](https://electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Electron |
| --- | --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Version

- Stable: [![npm package](https://img.shields.io/npm/v/ant-design-vue.svg?style=flat-square)](https://www.npmjs.org/package/ant-design-vue)

You can subscribe to this feed for new version notifications: <https://github.com/vueComponent/ant-design-vue/releases.atom>

## Installation

### Using npm or yarn

**We recommend using npm or yarn to install**, it not only makes development easier, but also allow you to take advantage of the rich ecosystem of Javascript packages and tooling.

```bash
$ npm install ant-design-vue@4.x --save
```

```bash
$ yarn add ant-design-vue@4.x
```

If you are in a bad network environment, you can try other registries and tools like [cnpm](https://github.com/cnpm/cnpm).

### Import in Browser

Add `script` and `link` tags in your browser and use the global variable `antd`.

We provide `antd.js` `antd.min.js` and `reset.css` under `ant-design-vue/dist` in antd's npm package. You can also download these files directly from [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/ant-design-vue/badge)](https://www.jsdelivr.com/package/npm/ant-design-vue) or [unpkg](https://unpkg.com/ant-design-vue/dist/).

> **We strongly discourage loading the entire files** this will add bloat to your application and make it more difficult to receive bugfixes and updates. Antd is intended to be used in conjunction with a build tool, such as [webpack](https://webpack.github.io/), which will make it easy to import only the parts of antd that you are using.

> Note: you should import `vue`, [dayjs](https://day.js.org/) and dayjs plugins before using `antd.js`.

Like:

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

## Usage

```jsx
import { DatePicker } from 'ant-design-vue';
app.use(DatePicker);
```

And import stylesheets manually:

```jsx
import 'ant-design-vue/dist/reset.css';
```

### Use modularized ant-design-vue

`ant-design-vue` supports ES modules tree shaking by default.

### Automatically import components on demand

#### [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)

If you're using 'Vite', we recommend using 'unplugin-vue-components'

```bash
$ npm install unplugin-vue-components -D
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
  plugins: [
    // ...
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
});
```

You can then import 'ant-design-vue' components directly in your code, and the plugin will automatically convert your code to 'import {Button} from 'ant-design-vue''.

```jsx
import { Button } from 'ant-design-vue';
```

## Links

- [Home Page](https://www.antdv.com/)
- [Ant Design Of React](https://ant.design/)
- [Components](https://www.antdv.com/components/overview)
- [Change Log](/docs/vue/changelog)
- [CodeSandbox template](https://codesandbox.io/s/agitated-franklin-1w72v) for bug reports
- [Customize Theme](/docs/vue/customize-theme)
- [FAQ](/docs/vue/faq)
- [Support US](/docs/vue/sponsor)
- [Awesome Ant Design](https://github.com/vueComponent/ant-design-vue-awesome)

## Contributing

If you'd like to help us improve ant-design-vue, just create a [Pull Request](https://github.com/vueComponent/ant-design-vue/pulls). Feel free to report bugs and issues [here](https://vuecomponent.github.io/issue-helper/).

> If you're new to posting issues, we ask that you read [_How To Ask Questions The Smart Way_](http://www.catb.org/~esr/faqs/smart-questions.html) and [How to Ask a Question in Open Source Community](https://github.com/seajs/seajs/issues/545) and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html) prior to posting. Well written bug reports help us help you!

## About ant-design-vue

As we all know, Ant Design, as a design language, has gone through many years of iteration and accumulation. Its UI design ideas have become a set of de facto standards and are sought after and loved by many front-end developers and enterprises, and it is also a magic weapon in the hands of React developers. I hope that ant-design-vue will allow Vue developers to enjoy the excellent design of Ant Design.

The ant-design-vue is the Vue implementation of Ant Design. The style of the component is kept in sync with Ant Design. The html structure and css style of the component are also consistent. The style 0 modification is really achieved, and the component API is kept as consistent as possible.

Ant Design Vue is committed to providing programmers with a **pleasant** development experience.

## THANK YOU

[Ant Design Team](https://github.com/ant-design/ant-design/blob/master/AUTHORS.txt)
