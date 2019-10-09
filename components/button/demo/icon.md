<cn>
#### 图标按钮
当需要在 `Button` 内嵌入 `Icon` 时，可以设置 `icon` 属性，或者直接在 `Button` 内使用 `Icon` 组件。
如果想控制 `Icon` 具体的位置，只能直接使用 `Icon` 组件，而非 `icon` 属性。
</cn>

<us>
#### Icon
`Button` components can contain an `Icon`. This is done by setting the `icon` property or placing an `Icon` component within the `Button`
If you want specific control over the positioning and placement of the `Icon`, then that should be done by placing the `Icon` component within the `Button` rather than using the `icon` property.
</us>

```tpl
<template>
  <div>
    <a-button type="primary" shape="circle" icon="search"></a-button>
    <a-button type="primary" icon="search">Search</a-button>
    <a-button shape="circle" icon="search" />
    <a-button icon="search">Search</a-button>
    <a-button shape="circle" icon="search" />
    <a-button icon="search">Search</a-button>
    <a-button type="dashed" shape="circle" icon="search" />
    <a-button type="dashed" icon="search">Search</a-button>
  </div>
</template>
```
