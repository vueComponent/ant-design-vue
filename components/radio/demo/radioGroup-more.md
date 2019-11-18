<cn>
#### RadioGroup 垂直
垂直的 RadioGroup，配合更多输入框选项。
</cn>

<us>
#### Vertical RadioGroup
Vertical RadioGroup, with more radios.
</us>

```tpl
<template>
  <a-radio-group @change="onChange" v-model="value">
    <a-radio :style="radioStyle" :value="1">Option A</a-radio>
    <a-radio :style="radioStyle" :value="2">Option B</a-radio>
    <a-radio :style="radioStyle" :value="3">Option C</a-radio>
    <a-radio :style="radioStyle" :value="4">
      More...
      <a-input v-if="value === 4" :style="{ width: 100, marginLeft: 10 }" />
    </a-radio>
  </a-radio-group>
</template>
<script>
  export default {
    data() {
      return {
        value: 1,
        radioStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        },
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
