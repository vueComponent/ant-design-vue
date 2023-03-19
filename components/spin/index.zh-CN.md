---
category: Components
type: 反馈
title: Spin
subtitle: 加载中
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*5mC5TomY4B0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*i43_ToFrL8YAAAAAAAAAAAAADrJ8AQ/original
---

用于页面和区块的加载中状态。

## 何时使用

页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| delay | 延迟显示加载效果的时间（防止闪烁） | number (毫秒) | - |  |
| indicator | 加载指示符 | vNode \| slot | - |  |
| size | 组件大小，可选值为 `small` `default` `large` | string | `default` |  |
| spinning | 是否为加载中状态 | boolean | true |  |
| tip | 当作为包裹元素时，可以自定义描述文案 | string \| slot | - | slot 3.0 |
| wrapperClassName | 包装器的类属性 | string | - |  |

### 静态方法

- `Spin.setDefaultIndicator({indicator})` 同上 `indicator`，你可以自定义全局默认元素

  ```jsx
  import { h } from 'vue';
  Spin.setDefaultIndicator({
    indicator: h('i', { class: 'anticon anticon-loading anticon-spin ant-spin-dot' }),
  });
  ```
