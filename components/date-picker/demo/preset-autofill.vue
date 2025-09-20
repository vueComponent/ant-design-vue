<docs>
---
order: 8
title:
  zh-CN: Preset自动回填
  en-US: Preset Auto Fill
---

## zh-CN

RangePicker 现在支持preset自动回填功能。当传入的value包含preset信息时，会根据preset自动计算对应的日期范围。

## en-US

RangePicker now supports preset auto fill functionality. When the passed value contains preset information, it will automatically calculate the corresponding date range based on the preset.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <div>
      <h4>Preset自动回填功能</h4>
      <p>当传入的value包含preset信息时，会根据preset自动计算日期范围</p>
      <p>
        <strong>当前设置：</strong>
        is-whole-day={{ isWholeDay }}，show-time=true
      </p>
      <p>
        <strong>行为：</strong>
        当isWholeDay为false时，点击preset时，会使用当前时间的时分秒，而不是00:00:00 - 23:59:59
      </p>
      <a-range-picker
        v-model:value="rangeValue"
        show-time
        :is-whole-day="isWholeDay"
        format="YYYY/MM/DD HH:mm:ss"
        :presets="rangePresets"
        @change="onRangeChange"
      />
    </div>

    <div>
      <h4>切换is-whole-day</h4>
      <p>
        <a-button @click="toggleIsWholeDay">切换is-whole-day</a-button>
      </p>
      <h4>测试按钮</h4>
      <a-space>
        <a-button @click="setTodayPreset">设置为今天preset</a-button>
        <a-button @click="setLast7DaysPreset">设置为最近7天preset</a-button>
        <a-button @click="setLast30DaysPreset">设置为最近30天preset</a-button>
        <a-button @click="setCurrentTimePreset">设置为当前时间preset</a-button>
        <a-button @click="clearValue">清空值</a-button>
      </a-space>
    </div>

    <div>
      <h4>当前值</h4>
      <pre>{{ JSON.stringify(rangeValue, null, 2) }}</pre>
    </div>
  </a-space>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';

type RangeValue = [Dayjs, Dayjs] | [Dayjs, Dayjs, any];

const isWholeDay = ref(false);

const rangeValue = ref<RangeValue | null>(null);

const onRangeChange = (values: RangeValue, dateStrings: [string, string], currentPreset?: any) => {
  if (values) {
    console.log('From: ', values[0], ', to: ', values[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    if (currentPreset) {
      console.log('Selected preset key: ', currentPreset.key);
      console.log('Selected preset label: ', currentPreset.label);
    } else {
      console.log('Manual selection (no preset)');
    }
  } else {
    console.log('Clear');
  }
};

const rangePresets = ref([
  {
    label: '今天',
    value: [dayjs().startOf('day'), dayjs().endOf('day')],
    key: 'today',
  },
  {
    label: '最近7天',
    value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')],
    key: 'last7days',
  },
  {
    label: '最近30天',
    value: [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')],
    key: 'last30days',
  },
  {
    label: '最近90天',
    value: [dayjs().subtract(90, 'day').startOf('day'), dayjs().endOf('day')],
    key: 'last90days',
  },
]);

const setTodayPreset = () => {
  const todayPreset = rangePresets.value.find(p => p.key === 'today');
  if (todayPreset) {
    // 传入包含preset信息的value，RangePicker会自动根据preset计算日期范围
    rangeValue.value = [dayjs(), dayjs(), todayPreset] as any;
  }
};

const setLast7DaysPreset = () => {
  const last7DaysPreset = rangePresets.value.find(p => p.key === 'last7days');
  if (last7DaysPreset) {
    // 传入包含preset信息的value，RangePicker会自动根据preset计算日期范围
    rangeValue.value = [dayjs(), dayjs(), last7DaysPreset] as any;
  }
};

const setLast30DaysPreset = () => {
  const last30DaysPreset = rangePresets.value.find(p => p.key === 'last30days');
  if (last30DaysPreset) {
    // 传入包含preset信息的value，RangePicker会自动根据preset计算日期范围
    rangeValue.value = [dayjs(), dayjs(), last30DaysPreset] as any;
  }
};

const setCurrentTimePreset = () => {
  // 创建一个包含当前时间的preset
  const currentTimePreset = {
    label: '当前时间',
    value: [dayjs(), dayjs()], // 使用当前时间，不设置startOf/endOf
    key: 'currentTime',
  };
  // 传入包含preset信息的value，RangePicker会自动根据preset计算日期范围
  rangeValue.value = [dayjs(), dayjs(), currentTimePreset] as any;
};

const clearValue = () => {
  rangeValue.value = null;
};

const toggleIsWholeDay = () => {
  isWholeDay.value = !isWholeDay.value;
};
</script>
