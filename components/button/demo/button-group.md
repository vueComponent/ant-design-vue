<cn>
#### 按钮组合
可以将多个 `Button` 放入 `Button.Group` 的容器中。
通过设置 `size` 为 `large` `small` 分别把按钮组合设为大、小尺寸。若不设置 `size`，则尺寸为中。
</cn>

<us>
#### Button Group
Buttons can be grouped by placing multiple `Button` components into a `Button.Group`.
The `size` can be set to `large`, `small` or left unset resulting in a default size.
</us>

```tpl
<template>
  <div id="components-button-demo-button-group">
    <h4>Basic</h4>
    <a-button-group>
      <a-button>Cancel</a-button>
      <a-button type="primary">OK</a-button>
    </a-button-group>
    <a-button-group>
      <a-button disabled>L</a-button>
      <a-button disabled>M</a-button>
      <a-button disabled>R</a-button>
    </a-button-group>
    <a-button-group>
      <a-button type="primary">L</a-button>
      <a-button>M</a-button>
      <a-button>M</a-button>
      <a-button type="dashed">R</a-button>
    </a-button-group>

    <h4>With Icon</h4>
    <a-button-group>
      <a-button type="primary"> <a-icon type="left" />Go back </a-button>
      <a-button type="primary"> Go forward<a-icon type="right" /> </a-button>
    </a-button-group>
    <a-button-group>
      <a-button type="primary" icon="cloud" />
      <a-button type="primary" icon="cloud-download" />
    </a-button-group>
  </div>
</template>
<style>
  #components-button-demo-button-group h4 {
    margin: 16px 0;
    font-size: 14px;
    line-height: 1;
    font-weight: normal;
  }
  #components-button-demo-button-group h4:first-child {
    margin-top: 0;
  }
  #components-button-demo-button-group .ant-btn-group {
    margin-right: 8px;
  }
</style>
```
