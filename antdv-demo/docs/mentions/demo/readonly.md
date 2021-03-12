<cn>
#### 无效或只读
通过 `disabled` 属性设置是否生效。通过 `readOnly` 属性设置是否只读。
</cn>

<us>
#### disabled or readOnly
Configurate disabled and readOnly.
</us>

```vue
<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-mentions placeholder="this is disabled Mentions" disabled>
        <a-mentions-option v-for="value in options" :key="value" :value="value">
          {{ value }}
        </a-mentions-option>
      </a-mentions>
    </div>
    <a-mentions placeholder="this is readOnly a-mentions" readonly>
      <a-mentions-option v-for="value in options" :key="value" :value="value">
        {{ value }}
      </a-mentions-option>
    </a-mentions>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: ['afc163', 'zombieJ', 'yesmeck'],
    };
  },
};
</script>
```
