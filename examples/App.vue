<template>
  <div>
    <a-card
      title="测试"
      :tab-props="{ size: 'small' }"
      :tab-list="[
        { key: 'tab1', tab: 'tab1' },
        { key: 'tab2', tab: 'tab2' },
      ]"
    />
    <a-card
      title="测试"
      :tab-props="{ size: 'large' }"
      :tab-list="[
        { key: 'tab1', tab: 'tab1' },
        { key: 'tab2', tab: 'tab2' },
      ]"
    />
    <a-card
      title="测试"
      :tab-props="{}"
      :tab-list="[
        { key: 'tab1', tab: 'tab1' },
        { key: 'tab2', tab: 'tab2' },
      ]"
    />
    <a-card
      title="测试"
      :tab-props="{ size: 'default' }"
      :tab-list="[
        { key: 'tab1', tab: 'tab1' },
        { key: 'tab2', tab: 'tab2' },
      ]"
    />

    <a-range-picker
      :placeholder="['Start month', 'End month']"
      format="YYYY-MM"
      :value="value"
      :mode="['year', 'year']"
      @panelChange="handleChange"
      @change="handleChange"
      :disabled-date="disabledDate"
    />
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data() {
    return {
      value: [],
      text: `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`,
    };
  },
  methods: {
    handleChange(value) {
      this.value = value;
    },
    disabledDate(current) {
      return (
        moment().endOf('month') < moment(current).endOf('month') ||
        moment().subtract('12', 'month').endOf('month') > moment(current).endOf('month')
      );
    },
  },
};
</script>
