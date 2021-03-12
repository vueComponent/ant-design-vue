<cn>
#### 折叠面板
可以同时展开多个面板，这个例子默认展开了第一个。
</cn>

<us>
#### Collapse
By default, any number of panels can be expanded at a time. The first panel is expanded in this example.
</us>

```vue
<template>
  <div>
    <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3" disabled>
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      activeKey: ['1'],
    };
  },
  watch: {
    activeKey(key) {
      console.log(key);
    },
  },
};
</script>
```
