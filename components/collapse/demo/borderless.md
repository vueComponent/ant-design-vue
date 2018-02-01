<cn>
#### 简洁风格
一套没有边框的简洁样式。
</cn>

<us>
#### Borderless
A borderless style of Collapse.
</us>

```html
<template>
  <div>
    <a-collapse :defaultValue="'1'" :bordered="false">
      <a-collapse-panel header="This is panel header 1" name="1">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 2" name="2" :disabled='false'>
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 3" name="3">
        <p>{{text}}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      }
    },
  }
</script>
```
