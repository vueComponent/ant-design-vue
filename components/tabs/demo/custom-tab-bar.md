<cn>
#### 自定义页签头
自定义页签头
</cn>

<us>
#### Customized bar of tab
Customized bar of tab.
</us>

```tpl
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="Tab 1" key="1" style="height: 200px">Content of Tab Pane 1</a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>
      <template slot="renderTabBar" slot-scope="props, DefaultTabBar">
        <component :is="DefaultTabBar" v-bind="props" :style="{ zIndex: 1, background: '#fff' }" />
      </template>
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
