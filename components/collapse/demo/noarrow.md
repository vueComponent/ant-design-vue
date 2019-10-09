<cn>
#### 隐藏箭头
你可以通过 `:showArrow="false"` 隐藏 `a-collapse-panel` 组件的箭头图标。
</cn>

<us>
#### No arrow
You can disable showing arrow icon by passing `:showArrow="false"` to `a-collapse-panel` component.
</us>

```tpl
<template>
  <div>
    <a-collapse defaultActiveKey="1" @change="changeActivekey">
      <a-collapse-panel header="This is panel header with arrow icon" key="1">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header with no arrow icon" key="2" :showArrow="false">
        <p>{{text}}</p>
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
