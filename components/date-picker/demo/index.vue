<template>
  <demo-sort>
    <Basic />
    <RangePicker />
    <Bordered />
    <Format />
    <Time />
    <Disabled />
    <DisabledDate />
    <SelectInRnage />
    <PresettedRanges />
    <ExtraFooter />
    <Size />
    <DateRender />
    <Mode />
    <Switchable />
    <Suffix />
    <statusVue />
    <placementVue />
  </demo-sort>
</template>
<script>
import Basic from './basic.vue';
import DateRender from './date-render.vue';
import DisabledDate from './disabled-date.vue';
import Disabled from './disabled.vue';
import ExtraFooter from './extra-footer.vue';
import Format from './format.vue';
import Mode from './mode.vue';
import PresettedRanges from './presetted-ranges.vue';
import SelectInRnage from './select-in-range.vue';
import Size from './size.vue';
import Switchable from './switchable.vue';
import Time from './time.vue';
import Suffix from './suffix.vue';
import Bordered from './bordered.vue';
import RangePicker from './range-picker.vue';
import placementVue from './placement.vue';
import statusVue from './status.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    statusVue,
    placementVue,
    Basic,
    DateRender,
    DisabledDate,
    Disabled,
    ExtraFooter,
    Format,
    Mode,
    PresettedRanges,
    Size,
    Switchable,
    Time,
    Suffix,
    SelectInRnage,
    Bordered,
    RangePicker,
  },
});
</script>
<style>
#components-date-picker-demo .ant-calendar-picker {
  margin: 0 8px 12px 0;
}
</style>
