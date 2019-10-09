<cn>
#### 基本用法
默认选中第一项。
</cn>

<us>
#### basic Usage
Default activate first tab.
</us>

```tpl
<template>
  <div>
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="Tab 1" key="1">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
  </div>
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
