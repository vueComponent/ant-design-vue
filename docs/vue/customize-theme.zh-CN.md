
# 定制主题

vue-antd-ui的组件结构及样式和Antd React完全一致，你可以参考Antd React的定制方式进行配置。

Ant Design 设计规范上支持一定程度的样式定制，以满足业务和品牌上多样化的视觉需求，包括但不限于主色、圆角、边框和部分组件的视觉定制。

![](https://zos.alipayobjects.com/rmsportal/zTFoszBtDODhXfLAazfSpYbSLSEeytoG.png)

## 样式变量

antd 的样式使用了 [Less](http://lesscss.org/) 作为开发语言，并定义了一系列全局/组件的样式变量，你可以根据需求进行相应调整。

- [默认样式变量](https://github.com/vueComponent/ant-design/blob/master/components/style/themes/default.less)

如果以上变量不能满足你的定制需求，可以给我们提 issue。

## 定制方式

我们使用 [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式来覆盖变量。
在具体工程实践中，有 `package.theme` 和 `less` 两种方案，选择一种即可。


### 1) theme 属性（推荐）

配置在 `package.json` 或 `.webpackrc` 下的 `theme` 字段。theme 可以配置为一个对象或文件路径。

```js
"theme": {
  "primary-color": "#1DA57A",
},
```
定义 `theme` 属性时，需要配合使用`less-loader` 的 `modifyVars` 配置来覆盖原来的样式变量。
可以参考 [atool-build 中 less-loader 的 webpack 相关配置](https://github.com/ant-tool/atool-build/blob/a4b3e3eec4ffc09b0e2352d7f9d279c4c28fdb99/src/getWebpackCommonConfig.js#L131-L138)

注意：

- 样式必须加载 less 格式。
  - 如果你在使用 [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 的 `style` 配置来引入样式，需要将配置值从 `'css'` 改为 `true`，这样会引入 less 文件。
  - 如果你是通过 `'vue-antd-ui/dist/antd.css'` 引入样式的，改为 `vue-antd-ui/dist/antd.less`。
- 如果要覆盖 `@icon-url` 变量，内容需要包括引号 `"@icon-url": "'your-icon-font-path'"`。

### 2) less

用 less 文件进行变量覆盖。

建立一个单独的 `less` 文件如下，再引入这个文件。

   ```less
   @import "~vue-antd-ui/dist/antd.less";   // 引入官方提供的 less 样式入口文件
   @import "your-theme-file.less";   // 用于覆盖上面定义的变量
   ```

注意：这种方式已经载入了所有组件的样式，不需要也无法和按需加载插件 `babel-plugin-import` 的 `style` 属性一起使用。

## 社区教程 for Antd React

- [How to Customize Ant Design with React & Webpack… the Missing Guide](https://medium.com/@GeoffMiller/how-to-customize-ant-design-with-react-webpack-the-missing-guide-c6430f2db10f)
- [Theming Ant Design with Sass and Webpack](https://gist.github.com/Kruemelkatze/057f01b8e15216ae707dc7e6c9061ef7)
