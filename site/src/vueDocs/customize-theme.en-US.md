# Customize Theme

The structure and styles of ant-design-vue are exactly the same as those of Antd. You can refer to the Antd React customization mode for configuration.

Ant Design allows you to customize some basic design aspects in order to meet the needs of UI diversity from business and brand, including primary color, border radius, border color, etc.

![](https://zos.alipayobjects.com/rmsportal/zTFoszBtDODhXfLAazfSpYbSLSEeytoG.png)

## Ant Design Vue Less variables

We are using [Less](http://lesscss.org/) as the development language for styling. A set of less variables are defined for each design aspect that can be customized to your needs.

There are some major variables below, all less variables could be found in [Default Variables](https://github.com/vueComponent/ant-design-vue/blob/next/components/style/themes/default.less).

```less
@primary-color: #1890ff; // primary color for all components
@link-color: #1890ff; // link color
@success-color: #52c41a; // success state color
@warning-color: #faad14; // warning state color
@error-color: #f5222d; // error state color
@font-size-base: 14px; // major text font size
@heading-color: rgba(0, 0, 0, 0.85); // heading text color
@text-color: rgba(0, 0, 0, 0.85); // major text color
@text-color-secondary: rgba(0, 0, 0, 0.45); // secondary text color
@disabled-color: rgba(0, 0, 0, 0.25); // disable state color
@border-radius-base: 4px; // major border radius
@border-color-base: #d9d9d9; // major border color
@box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15); // major shadow for layers
```

Please report an issue if the existing list of variables is not enough for you.

## How to do it

We will use [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) provided by less.js to override the default values of the variables. We now introduce some popular way to do it depends on different workflow.

### Customize in webpack

We take a typical `webpack.config.js` file as example to customize it's [less-loader](https://github.com/webpack-contrib/less-loader) options.

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

Note that do not exclude antd package in node_modules when using less-loader.

### Customize in vue cli 2

Modify the `build/utils.js` file

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

### Customize in vue cli 3

Create a new file `vue.config.js` in the project directory.

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

### Customize in less file

Another approach to customize theme is creating a `less` file within variables to override `antd.less`.

```css
@import '~ant-design-vue/dist/antd.less'; // Import Ant Design Vue styles by less entry
@import 'your-theme-file.less'; // variables to override above
```

Note: This way will load the styles of all components, regardless of your demand, which cause `style` option of `babel-plugin-import` not working.

## How to avoid modifying global styles?

Currently ant-design-vue is designed as a whole experience and modify global styles (eg `body` etc). If you need to integrate ant-design-vue as a part of an existing website, it's likely you want to prevent ant-design-vue to override global styles.

While there's no canonical way to do it, you can take one of the following paths :

### Configure webpack to load an alternale less file and scope global styles

It's possible to configure webpack to load an alternate less file:

```js
new webpack.NormalModuleReplacementPlugin( /node_modules\/ant-design-vue\/lib\/style\/index\.less/, path.resolve(rootDir, 'src/myStylesReplacement.less') )

#antd { @import '~ant-design-vue/lib/style/core/index.less'; @import '~ant-design-vue/lib/style/themes/default.less'; }
```

Where the src/myStylesReplacement.less file loads the same files as the index.less file, but loads them within the scope of a top-level selector : the result is that all of the "global" styles are being applied with the #antd scope.

### Use a postcss processor to scope all styles

See an example of usage with gulp and [postcss-prefixwrap](https://github.com/dbtedman/postcss-prefixwrap) : https://gist.github.com/sbusch/a90eafaf5a5b61c6d6172da6ff76ddaa

## Not working?

You must import styles as less format. A common mistake would be importing multiple copied of styles that some of them are css format to override the less styles.

- If you import styles by specifying the `style` option of [babel-plugin-import](https://github.com/ant-design/babel-plugin-import), change it from `'css'` to `true`, which will import the `less` version of antd.
- If you import styles from `'ant-design-vue/dist/antd.css'`, change it to `ant-design-vue/dist/antd.less`.

## Use dark theme

Method 1: Import [antd.dark.less](https://unpkg.com/browse/ant-design-vue@2.0.0/dist/antd.dark.less) in the style file:

```less
@import '~ant-design-vue/dist/antd.dark.less'; // Introduce the official dark less style entry file
```

If the project does not use Less, you can import [antd.dark.css](https://unpkg.com/browse/ant-design-vue@2.0.0/dist/antd.dark.css) in the CSS file:

```css
@import '~ant-design-vue/dist/antd.dark.css';
```

> Note that you don't need to import `ant-design-vue/dist/antd.less` or `ant-design-vue/dist/antd.css` anymore, please remove it, and remove babel-plugin-import `style` config too. You can't enable two or more theme at the same time by this method.

Method 3: using [less-loader](https://github.com/webpack-contrib/less-loader) in `webpack.config.js` to introduce as needed:

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
+       lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
+         modifyVars: getThemeVariables({
+           dark: true, // Enable dark mode
+         }),
+         javascriptEnabled: true,
+       },
+     },
    }],
  }],
};
```

## Related Articles

- [How to Customize Ant Design with React & Webpack… the Missing Guide](https://medium.com/@GeoffMiller/how-to-customize-ant-design-with-react-webpack-the-missing-guide-c6430f2db10f)
- [Theming Ant Design with Sass and Webpack](https://gist.github.com/Kruemelkatze/057f01b8e15216ae707dc7e6c9061ef7)
