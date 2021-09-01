<docs>
---
order: 2
title:
  zh-CN: 受控的 checkbox
  en-US: Controlled Checkbox
---

## zh-CN

联动checkbox

## en-US

Communicated with other components

</docs>

<template>
  <p :style="{ marginBottom: '20px' }">
    <a-checkbox v-model:checked="checked" :disabled="disabled">
      {{ label }}
    </a-checkbox>
  </p>
  <p>
    <a-button type="primary" size="small" @click="toggleChecked">
      {{ !checked ? 'Check' : 'Uncheck' }}
    </a-button>
    <a-button :style="{ marginLeft: '10px' }" type="primary" size="small" @click="toggleDisable">
      {{ !disabled ? 'Disable' : 'Enable' }}
    </a-button>
  </p>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const checked = ref(false);
    const disabled = ref(false);

    const toggleChecked = () => {
      checked.value = !checked.value;
    };

    const toggleDisable = () => {
      disabled.value = !disabled.value;
    };

    const label = computed(() => {
      return `${checked.value ? 'Checked' : 'Unchecked'}-${
        disabled.value ? 'Disabled' : 'Enabled'
      }`;
    });

    return {
      label,
      checked,
      disabled,
      toggleChecked,
      toggleDisable,
    };
  },
});
</script>
