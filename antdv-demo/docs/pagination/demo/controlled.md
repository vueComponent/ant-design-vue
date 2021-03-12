<cn>
#### 受控
受控制的页码。
</cn>

<us>
#### Controlled
Controlled page number.
</us>

```vue
<template>
  <a-pagination :current="current" :total="50" @change="onChange" />
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
