<cn>
#### 滑动
可以左右、上下滑动，容纳更多标签。
</cn>

<us>
#### Slide
In order to fit in more tabs, they can slide left and right (or up and down).
</us>

```tpl
<template>
  <div style="width: 500px">
    <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="top">Horizontal</a-radio-button>
      <a-radio-button value="left">Vertical</a-radio-button>
    </a-radio-group>
    <a-tabs
      defaultActiveKey="1"
      :tabPosition="mode"
      :style="{ height: '200px'}"
      @prevClick="callback"
      @nextClick="callback"
    >
      <a-tab-pane tab="Tab 1" key="1">Content of tab 1</a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2">Content of tab 2</a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3">Content of tab 3</a-tab-pane>
      <a-tab-pane tab="Tab 4" key="4">Content of tab 4</a-tab-pane>
      <a-tab-pane tab="Tab 5" key="5">Content of tab 5</a-tab-pane>
      <a-tab-pane tab="Tab 6" key="6">Content of tab 6</a-tab-pane>
      <a-tab-pane tab="Tab 7" key="7">Content of tab 7</a-tab-pane>
      <a-tab-pane tab="Tab 8" key="8">Content of tab 8</a-tab-pane>
      <a-tab-pane tab="Tab 9" key="9">Content of tab 9</a-tab-pane>
      <a-tab-pane tab="Tab 10" key="10">Content of tab 10</a-tab-pane>
      <a-tab-pane tab="Tab 11" key="11">Content of tab 11</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        mode: 'top',
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
