<cn>
#### 事件
当 Slider 的值发生改变时，会触发 `onChange` 事件，并把改变后的值作为参数传入。在 `onmouseup` 时，会触发 `onAfterChange` 事件，并把当前值作为参数传入。
</cn>

<us>
#### Event
The `onChange` callback function will fire when the user changes the slider's value.
The `onAfterChange` callback function will fire when `onmouseup` fired.
</us>

```tpl
<template>
  <div class="code-box-demo">
    <a-slider :defaultValue="30" @change="onChange" @afterChange="onAfterChange" />
    <a-slider
      range
      :step="10"
      :defaultValue="[20, 50]"
      @change="onChange"
      @afterChange="onAfterChange"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        disabled: false,
      };
    },
    methods: {
      onChange(value) {
        console.log('change: ', value);
      },
      onAfterChange(value) {
        console.log('afterChange: ', value);
      },
    },
  };
</script>
<style scoped>
  .code-box-demo .ant-slider {
    margin-bottom: 16px;
  }
</style>
```
