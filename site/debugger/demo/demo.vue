<template>
  <div>
    <a-radio v-model:checked="checked1" :disabled="disabled">Disabled</a-radio>
    <a-radio v-model:checked="checked2" :disabled="disabled">Disabled</a-radio>
    <br />
    <div style="margin-top: 16px">
      <a-button type="primary" @click="toggleDisabled">Toggle disabled</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const disabled = ref<boolean>(true);
    const checked1 = ref<boolean>(false);
    const checked2 = ref<boolean>(false);

    const toggleDisabled = () => {
      disabled.value = !disabled.value;
    };

    return {
      disabled,
      checked1,
      checked2,
      toggleDisabled,
    };
  },
});
</script>
