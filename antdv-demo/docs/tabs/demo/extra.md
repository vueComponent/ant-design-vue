<cn>
#### 附加内容
可以在页签右边添加附加操作。
</cn>

<us>
#### Extra content
You can add extra actions to the right of Tabs.
</us>

```vue
<template>
  <a-tabs>
    <a-tab-pane key="1" tab="Tab 1">
      Content of tab 1
    </a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2">
      Content of tab 2
    </a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">
      Content of tab 3
    </a-tab-pane>
    <a-button slot="tabBarExtraContent">
      Extra Action
    </a-button>
  </a-tabs>
</template>
```
