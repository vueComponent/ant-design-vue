# 定制主题

ant-design-vue 的组件结构及样式和 Antd React 完全一致，你可以参考 Antd React 的定制方式进行配置。

Ant Design 设计规范上支持一定程度的样式定制，以满足业务和品牌上多样化的视觉需求，包括但不限于主色、圆角、边框和部分组件的视觉定制。

![](https://zos.alipayobjects.com/rmsportal/zTFoszBtDODhXfLAazfSpYbSLSEeytoG.png)

## Ant Design Vue 的样式变量

antd 的样式使用了 [Less](http://lesscss.org/) 作为开发语言，并定义了一系列全局/组件的样式变量，你可以根据需求进行相应调整。

以下是一些最常用的通用变量，所有样式变量可以在 [这里](https://github.com/vueComponent/ant-design-vue/blob/next/components/style/themes/default.less) 找到。

```less
@primary-color: #1890ff; // 全局主色
@link-color: #1890ff; // 链接色
@success-color: #52c41a; // 成功色
@warning-color: #faad14; // 警告色
@error-color: #f5222d; // 错误色
@font-size-base: 14px; // 主字号
@heading-color: rgba(0, 0, 0, 0.85); // 标题色
@text-color: rgba(0, 0, 0, 0.65); // 主文本色
@text-color-secondary: rgba(0, 0, 0, 0.45); // 次文本色
@disabled-color: rgba(0, 0, 0, 0.25); // 失效色
@border-radius-base: 4px; // 组件/浮层圆角
@border-color-base: #d9d9d9; // 边框色
@box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15); // 浮层阴影
```

如果以上变量不能满足你的定制需求，可以给我们提 issue。

## 定制方式

我们使用 [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式来进行覆盖变量。下面将针对不同的场景提供一些常用的定制方式。

### 在 webpack 中定制主题

我们以 webpack@4 为例进行说明，以下是一个 `webpack.config.js` 的典型例子，对 [less-loader](https://github.com/webpack-contrib/less-loader) 的 options 属性进行相应配置。

```diff
// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       lessOptions: {
+         modifyVars: {
+           'primary-color': '#1DA57A',
+           'link-color': '#1DA57A',
+           'border-radius-base': '2px',
+         },
+         javascriptEnabled: true,
+       }
+     },
    }],
    // ...other rules
  }],
  // ...other config
}
```

注意 less-loader 的处理范围不要过滤掉 `node_modules` 下的 antd 包。

### 在 vue cli 2 中定制主题

修改`build/utils.js`文件

```diff
// build/utils.js
- less: generateLoaders('less'),
+ less: generateLoaders('less', {
+   modifyVars: {
+     'primary-color': '#1DA57A',
+     'link-color': '#1DA57A',
+     'border-radius-base': '2px',
+   },
+   javascriptEnabled: true,
+ }),

```

### 在 vue cli 3 中定制主题

项目根目录下新建文件`vue.config.js`

```js
// vue.config.js for less-loader@6.0.0
module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
```

### 配置 less 变量文件

另外一种方式是建立一个单独的 `less` 变量文件，引入这个文件覆盖 `antd.less` 里的变量。

```css
@import '~ant-design-vue/dist/antd.less'; // 引入官方提供的 less 样式入口文件
@import 'your-theme-file.less'; // 用于覆盖上面定义的变量
```

注意，这种方式已经载入了所有组件的样式，不需要也无法和按需加载插件 `babel-plugin-import` 的 `style` 属性一起使用。

## 没有生效？

注意样式必须加载 less 格式，一个常见的问题就是引入了多份样式，less 的样式被 css 的样式覆盖了。

- 如果你在使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 的 `style` 配置来引入样式，需要将配置值从 `'css'` 改为 `true`，这样会引入 less 文件。
- 如果你是通过 `'ant-design-vue/dist/antd.css'` 引入样式的，改为 `ant-design-vue/dist/antd.less`。

## 使用暗黑主题

方式一：在样式文件全量引入 [antd.dark.less](https://unpkg.com/browse/ant-design-vue@2.0.0/dist/antd.dark.less)。
```less
@import '~ant-design-vue/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
```

如果项目不使用 Less，可在 CSS 文件中全量引入 [antd.dark.css](https://unpkg.com/browse/ant-design-vue@2.0.0/dist/antd.dark.css)。

```css
@import '~ant-design-vue/dist/antd.dark.css';
```

> 注意这种方式下你不需要再引入 `ant-design-vue/dist/antd.less` 或 `ant-design-vue/dist/antd.css` 了，可以安全移除掉。也不需要开启 babel-plugin-import 的 `style` 配置。通过此方式不能同时配置两种及以上主题。

方式二：是用在 `webpack.config.js` 使用 [less-loader](https://github.com/webpack-contrib/less-loader) 按需引入：

```diff
const { getThemeVariables } = require('ant-design-vue/dist/theme');

// webpack.config.js
module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
+     options: {
+       lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
+         modifyVars: getThemeVariables({
+           dark: true, // 开启暗黑模式
+         }),
+         javascriptEnabled: true,
+       },
+     },
    }],
  }],
};
```

## 社区教程 for Antd React

- [How to Customize Ant Design with React & Webpack… the Missing Guide](https://medium.com/@GeoffMiller/how-to-customize-ant-design-with-react-webpack-the-missing-guide-c6430f2db10f)
- [Theming Ant Design with Sass and Webpack](https://gist.github.com/Kruemelkatze/057f01b8e15216ae707dc7e6c9061ef7)
