<cn>
#### 单选组合
一组互斥的 Radio 配合使用。
</cn>

<us>
#### Radio Group
A group of radio components.
</us>

```tpl
<template>
  <div>
    <a-radio-group @change="onChange" v-model="value">
      <a-radio :value="1">A</a-radio>
      <a-radio :value="2">B</a-radio>
      <a-radio :value="3">C</a-radio>
      <a-radio :value="4">D</a-radio>
    </a-radio-group>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: 1,
      };
    },
    methods: {
      onChange(e) {
        console.log('radio checked', e.target.value);
      },
    },
  };
</script>
```
