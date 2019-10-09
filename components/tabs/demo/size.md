<cn>
#### 大小
大号页签用在页头区域，小号用在弹出框等较狭窄的容器内。
</cn>

<us>
#### Size
Large size tabs are usally used in page header, and small size could be used in Modal.
</us>

```tpl
<template>
  <div>
    <a-radio-group v-model="size" style="margin-bottom: 16px">
      <a-radio-button value="small">Small</a-radio-button>
      <a-radio-button value="default">Default</a-radio-button>
      <a-radio-button value="large">Large</a-radio-button>
    </a-radio-group>
    <a-tabs defaultActiveKey="2" :size="size">
      <a-tab-pane tab="Tab 1" key="1">Content of tab 1</a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2">Content of tab 2</a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3">Content of tab 3</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        size: 'small',
      };
    },
  };
</script>
```
