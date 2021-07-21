<template>
  <a-space direction="vertical">
    <!-- <a-date-picker v-model:value="value1" /> -->
    <!-- <a-month-picker v-model:value="value2" placeholder="Select month" />
    <a-week-picker v-model:value="value4" placeholder="Select week" /> -->
    <a-range-picker v-model:value="value3" />
  </a-space>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Moment } from 'moment';
export default defineComponent({
  setup() {
    const value1 = ref<Moment>();
    watch(value1, () => {
      console.log(value1);
    });
    return {
      value1,
      value2: ref<Moment>(),
      value3: ref<Moment[]>([]),
      value4: ref<Moment>(),
    };
  },
});
</script>
