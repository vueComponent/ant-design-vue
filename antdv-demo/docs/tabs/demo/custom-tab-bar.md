<cn>
#### 自定义页签头
自定义页签头
</cn>

<us>
#### Customized bar of tab
Customized bar of tab.
</us>

```vue
<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Tab 1" style="height: 200px">
        Content of Tab Pane 1
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2" force-render>
        Content of Tab Pane 2
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
        Content of Tab Pane 3
      </a-tab-pane>
      <template slot="renderTabBar" slot-scope="{ props, on, class: cls }, DefaultTabBar">
        <component
          :is="DefaultTabBar"
          v-bind="props"
          :class="cls"
          :style="{ zIndex: 1, background: '#fff' }"
          v-on="on"
        />
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
