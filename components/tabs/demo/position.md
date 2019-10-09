<cn>
#### 位置
有四个位置，`tabPosition="left|right|top|bottom"`。
</cn>

<us>
#### Position
Tab's position: left, right, top or bottom.
</us>

```tpl
<template>
  <div style="width: 500px">
    <a-radio-group v-model="tabPosition" style="margin:8px">
      <a-radio-button value="top">top</a-radio-button>
      <a-radio-button value="bottom">bottom</a-radio-button>
      <a-radio-button value="left">left</a-radio-button>
      <a-radio-button value="right">right</a-radio-button>
    </a-radio-group>
    <a-tabs defaultActiveKey="1" :tabPosition="tabPosition">
      <a-tab-pane tab="Tab 1" key="1">Content of Tab 1</a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2">Content of Tab 2</a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3">Content of Tab 3</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tabPosition: 'top',
      };
    },
    methods: {
      callback(val) {
        console.log(val);
      },
    },
  };
</script>
```
