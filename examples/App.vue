<template>
  <a-alert :message="`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`" />
  <a-calendar :value="date" @select="onSelect" @panelChange="onPanelChange" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

export default defineComponent({
  setup() {
    const date = ref(dayjs('2017-01-25'));
    const selectedValue = ref(dayjs('2017-01-25'));

    const onSelect = (value: Dayjs) => {
      date.value = value;
      selectedValue.value = value;
    };
    const onPanelChange = (value: Dayjs) => {
      date.value = value;
    };
    return {
      date,
      selectedValue,
      onSelect,
      onPanelChange,
    };
  },
});
</script>
