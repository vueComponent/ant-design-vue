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
      <a-tab-pane v-for="i in 30" :tab="`Tab-${i}`" :key="i">Content of tab {{i}}</a-tab-pane>
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
