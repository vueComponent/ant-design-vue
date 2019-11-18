<cn>
#### 基本用法
最简单的用法。
</cn>

<us>
#### basic Usage
The most basic usage.
</us>

```tpl
<template>
  <div>
    <a-switch defaultChecked @change="onChange" />
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    methods: {
      onChange(checked) {
        console.log(`a-switch to ${checked}`);
      },
    },
  };
</script>
```
