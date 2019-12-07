## API

### Row

| 成员 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | flex 布局下的垂直对齐方式：`top` `middle` `bottom` | string | `top` |
| gutter | 栅格间隔，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` | number/object | 0 |
| justify | flex 布局下的水平排列方式：`start` `end` `center` `space-around` `space-between` | string | `start` |
| type | 布局模式，可选 `flex`，[现代浏览器](http://caniuse.com/#search=flex) 下有效 | string |  |

### Col

| 成员   | 说明                                                     | 类型           | 默认值 |
| ------ | -------------------------------------------------------- | -------------- | ------ |
| offset | 栅格左侧的间隔格数，间隔内不可以有栅格                   | number         | 0      |
| order  | 栅格顺序，`flex` 布局模式下有效                          | number         | 0      |
| pull   | 栅格向左移动格数                                         | number         | 0      |
| push   | 栅格向右移动格数                                         | number         | 0      |
| span   | 栅格占位格数，为 0 时相当于 `display: none`              | number         | -      |
| xs     | `<576px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| sm     | `≥576px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| md     | `≥768px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| lg     | `≥992px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| xl     | `≥1200px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number\|object | -      |
| xxl    | `≥1600px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number\|object | -      |

响应式栅格的断点扩展自 [BootStrap 4 的规则](https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints)（不包含链接里 `occasionally` 的部分)。
