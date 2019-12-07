<cn>
#### 带输入框的滑块
和 [数字输入框](/components/input-number-cn/) 组件保持同步。
</cn>

<us>
#### Slider with InputNumber
Synchronize with [InputNumber](/components/input-number/) component.
</us>

```tpl
<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-slider :min="1" :max="20" v-model="inputValue1" />
      </a-col>
      <a-col :span="4">
        <a-input-number :min="1" :max="20" style="marginLeft: 16px" v-model="inputValue1" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-slider :min="0" :max="1" v-model="inputValue" :step="0.01" />
      </a-col>
      <a-col :span="4">
        <a-input-number
          :min="0"
          :max="1"
          :step="0.01"
          style="marginLeft: 16px"
          v-model="inputValue"
        />
      </a-col>
    </a-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        inputValue: 0,
        inputValue1: 1,
      };
    },
  };
</script>
<style scoped>
  .code-box-demo .ant-slider {
    margin-bottom: 16px;
  }
</style>
```
