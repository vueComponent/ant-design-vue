<template>
  <demo-sort>
    <Basic />
    <Bordered/>
    <RangePicker/>
    <Hours />
    <Addon />
    <Disabled />
    <HideColumn />
    <IntervalOptions />
    <Size />
    <Suffix />
  </demo-sort>
</template>

<script>
import Hours from './12hours.vue';
import Addon from './addon.vue';
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import HideColumn from './hide-column.vue';
import IntervalOptions from './interval-options.vue';
import Size from './size.vue';
import Suffix from './suffix.vue';
import Bordered from './bordered.vue';
import RangePicker from './range-picker.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

export default {
  CN,
  US,
  components: {
    Hours,
    Addon,
    Basic,
    Disabled,
    HideColumn,
    IntervalOptions,
    Size,
    Suffix,
    Bordered,
    RangePicker,
  },
};
</script>
<style>
[id^='components-time-picker-demo'] .ant-time-picker {
  margin: 0 8px 12px 0;
}
</style>
