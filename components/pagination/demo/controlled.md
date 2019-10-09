<cn>
#### 受控
受控制的页码。
</cn>

<us>
#### Controlled
Controlled page number.
</us>

```tpl
<template>
  <a-pagination @change="onChange" :current="current" :total="50" />
</template>
<script>
  export default {
    data() {
      return {
        current: 3,
      };
    },
    methods: {
      onChange(current) {
        this.current = current;
      },
    },
  };
</script>
```
