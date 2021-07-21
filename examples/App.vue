<template>
  <a-space direction="vertical">
    <a-date-picker show-time placeholder="Select Time" @change="onChange" @ok="onOk" />
    <a-range-picker
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      @change="onChange"
      @ok="onOk"
    />
  </a-space>
</template>
<script lang="ts">
import { Moment } from 'moment';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const onChange = (value: Moment[], dateString: string[]) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    };

    const onOk = (value: Moment[]) => {
      console.log('onOk: ', value);
    };

    return {
      onChange,
      onOk,
    };
  },
});
</script>
