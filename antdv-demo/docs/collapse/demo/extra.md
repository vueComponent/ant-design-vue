<cn>
#### 额外节点
可以同时展开多个面板，这个例子默认展开了第一个。
</cn>

<us>
#### Extra node
More than one panel can be expanded at a time, the first panel is initialized to be active in this case.
</us>

```vue
<template>
  <div>
    <a-collapse v-model="activeKey" :expand-icon-position="expandIconPosition">
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
        <a-icon slot="extra" type="setting" @click="handleClick" />
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
        <a-icon slot="extra" type="setting" @click="handleClick" />
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3" disabled>
        <p>{{ text }}</p>
        <a-icon slot="extra" type="setting" @click="handleClick" />
      </a-collapse-panel>
    </a-collapse>
    <br />
    <span>Expand Icon Position: </span>
    <a-select v-model="expandIconPosition">
      <a-select-option value="left">
        left
      </a-select-option>
      <a-select-option value="right">
        right
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      activeKey: ['1'],
      expandIconPosition: 'left',
    };
  },
  watch: {
    activeKey(key) {
      console.log(key);
    },
  },
  methods: {
    handleClick(event) {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    },
  },
};
</script>
```
