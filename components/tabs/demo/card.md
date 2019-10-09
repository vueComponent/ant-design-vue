<cn>
#### 卡片式页签
另一种样式的页签，不提供对应的垂直样式。
</cn>

<us>
#### Card type tab
Another type Tabs, which doesn't support vertical mode.
</us>

```tpl
<template>
  <a-tabs @change="callback" type="card">
    <a-tab-pane tab="Tab 1" key="1">Content of Tab Pane 1</a-tab-pane>
    <a-tab-pane tab="Tab 2" key="2">Content of Tab Pane 2</a-tab-pane>
    <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {
      callback(key) {
        console.log(key);
      },
    },
  };
</script>
```
