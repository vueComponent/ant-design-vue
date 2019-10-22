<cn>
#### 简洁风格
一套没有边框的简洁样式。
</cn>

<us>
#### Borderless
A borderless style of Collapse.
</us>

```tpl
<template>
  <div>
    <a-collapse defaultActiveKey="1" :bordered="false">
      <a-collapse-panel header="This is panel header 1" key="1">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 2" key="2" :disabled="false">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 3" key="3">
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
  };
</script>
```
