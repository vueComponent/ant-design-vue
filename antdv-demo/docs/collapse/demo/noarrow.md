<cn>
#### 隐藏箭头
你可以通过 `:showArrow="false"` 隐藏 `a-collapse-panel` 组件的箭头图标。
</cn>

<us>
#### No arrow
You can hide the arrow icon by passing `showArrow={false}` to `CollapsePanel` component.
</us>

```vue
<template>
  <div>
    <a-collapse default-active-key="1" @change="changeActivekey">
      <a-collapse-panel key="1" header="This is panel header with arrow icon">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel
        key="2"
        header="This is panel header with no arrow icon"
        :show-arrow="false"
      >
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
    };
  },
  methods: {
    changeActivekey(key) {
      console.log(key);
    },
  },
};
</script>
```
