# FAQ

Here are the frequently asked questions about Ant Design Vue that you should look up before you ask in community or create new issue. 

### Are you going to provide Sass/Stylus(etc...) style file?

No, actually, you can convert Less to Sass/Stylus(etc...) with tools (which you can Google).

### `Select Dropdown DatePicker TimePicker Popover Popconfirm` disappear when I click another popup component inside it, How to resolve it?

Use `<a-select :getPopupContainer="trigger => trigger.parentNode">` to render component inside Popover. (Or other getXxxxContainer props)

### `Select Dropdown DatePicker TimePicker Popover Popconfirm` scroll with the page?

Use `<a-select :getPopupContainer="trigger => trigger.parentNode">` to render component inside the scroll area. (Or other getXxxxContainer props).

### `Form` does not support two-way binding, can't use `v-model`?

First, we do not recommend using two-way binding in the Form, the same data may be used in multiple places, if you use two-way binding, then the data modification will be synchronized to each component, but this is not what we want, you Data should be synchronized when the form is submitted successfully or fails or confirmed. With a non-bidirectionally bound form, you have maximum control over data modification/synchronization.

Second, if you don't use the form's automatic check/collection feature, ie you don't use the `v-decorator` modifier, you can still use `v-model`.

### How to modify the default theme of Ant Design Vue?

See [Customize Theme](/docs/vue/customize-theme/)。

### How to optimize momentjs bundle size with webpack?

See: https://github.com/jmblog/how-to-optimize-momentjs-with-webpack

### It doesn't work when I change `defaultValue`,`defaultOpenKeys`, `initialValue` dynamically.

The `defaultXxxx` (like `defaultValue`) of `Input`/`Select`(etc...) only works in first render. This feature is referenced from [React](https://facebook.github.io/react/docs/forms.html#controlled-components).

### I set the `value` of `Input`/`Select`(etc...), and then, it cannot be changed by user's action.

Try `defaultValue` or `change` or `v-model` to change `value`.

### ant-design-vue override my global styles!

Yes, ant-design-vue is designed to develop a complete background application, we override some global styles for styling convenience, and it can't be removed now. More info trace https://github.com/ant-design/ant-design/issues/4331 .

Or, follow the instructions in [How to avoid modifying global styles?](docs/react/customize-theme#How-to-avoid-modifying-global-styles-?)

