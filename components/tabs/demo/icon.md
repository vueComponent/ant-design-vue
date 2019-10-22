<cn>
#### 图标
有图标的标签。
</cn>

<us>
#### Icon
The Tab with Icon.
</us>

```tpl
<template>
  <a-tabs defaultActiveKey="2">
    <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="apple" />
        Tab 1
      </span>
      Tab 1
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="android" />
        Tab 2
      </span>
      Tab 2
    </a-tab-pane>
  </a-tabs>
</template>
```
