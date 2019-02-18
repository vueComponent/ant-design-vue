
# 常见问题

以下整理了一些 Ant Design Vue 社区常见的问题和官方答复，在提问之前建议找找有没有类似的问题。

### 你们会提供 Sass/Stylus 等格式的样式文件吗？

不。事实上你可以使用工具（请自行 Google）将 Less 转换成 Sass/Stylus 等。

### 当我点击 `Select Dropdown DatePicker TimePicker Popover Popconfirm` 内的另一个 popup 组件时它会消失，如何解决？

使用 `<a-select :getPopupContainer="trigger => trigger.parentNode">` 来在 Popover 中渲染组件，或者使用其他的 getXxxxContainer 参数。

### `Select Dropdown DatePicker TimePicker Popover Popconfirm` 会跟随滚动条上下移动？

使用 `<a-select :getPopupContainer="trigger => trigger.parentNode">` 来将组件渲染到滚动区域内，或者使用其他的 getXxxxContainer 参数。

### `Form`表单不支持双向绑定，不能使用`v-model`？
第一、我们不推荐在Form中使用双向绑定，同一份数据可能在多处使用，如果使用双向绑定，那么数据的修改会同时同步到各个组件，但这并不是我们想要的， 你应该在表单提交成功或失败或确认时同步数据，使用非双向绑定的表单，你会拥有最大限度的控制数据修改/同步的权限。

第二、如果你不使用表单的自动校验/收集功能，即没有使用`v-decorator`修饰过得组件，你依然可以使用`v-model`。

### 如何修改 Ant Design Vue 的默认主题？

参考[主题定制](/docs/vue/customize-theme/)。

### 如何配置 webpack 以优化 momentjs 的打包大小？

参考：https://github.com/jmblog/how-to-optimize-momentjs-with-webpack 。

### 当我动态改变 `defaultValue`,`defaultOpenKeys`, `initialValue`等`defaultXxxx`的时候它并没有生效。

`Input`/`Select` 等的 `defaultXxxx`（例如 `defaultValue`）只有在组件第一次渲染的时候有效，此特性参考自[React](https://reactjs.org/docs/forms.html#controlled-components)。
切记：第一次、第一次、第一次....

### 当我设置了 `Input`/`Select` 等的 `value` 时它就无法修改了。

尝试使用 `defaultValue` 或 `change` 或 `v-model` 来改变 `value`。

### ant-design-vue 覆盖了我的全局样式！

是的，ant-design-vue 在设计的时候就是用来开发一个完整的应用的，为了方便，我们覆盖了一些全局样式，现在还不能移除，想要了解更多请追踪这个 issue：https://github.com/ant-design/ant-design/issues/4331 ，或者参考这个教程 [How to avoid modifying global styles?](docs/react/customize-theme#How-to-avoid-modifying-global-styles-?)

### `ant-design-vue` 在移动端体验不佳。

`ant-design-vue` 并非针对移动端设计。

