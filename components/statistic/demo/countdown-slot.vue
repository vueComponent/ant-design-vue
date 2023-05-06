<docs>
---
order: 4
title:
  zh-CN: 倒计时组件
  en-US: Countdown
---

## zh-CN

倒计时组件使用插槽。

## en-US

Countdown component slots.

</docs>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic-countdown :value="deadline" style="margin-right: 50px" @finish="onFinish">
        <template #title>
          <span>Countdown</span>
          <a-tooltip placement="right">
            <template #title>
              <span>hurry up!</span>
            </template>
            <question-circle-two-tone style="margin-left: 5px" />
          </a-tooltip>
        </template>
      </a-statistic-countdown>
    </a-col>
    <a-col :span="24" style="margin-top: 32px">
      <a-statistic-countdown
        title="Million Seconds countdown"
        :value="deadline"
        format="HH:mm:ss:SSS"
        style="margin-right: 50px"
      >
        <template #prefix>
          <span>There's only</span>
        </template>
        <template #suffix>
          <span>left for the end.</span>
        </template>
      </a-statistic-countdown>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { QuestionCircleTwoTone } from '@ant-design/icons-vue';
const onFinish = () => {
  console.log('finished!');
};
const deadline = Date.now() + 1000 * 60 * 60 * 20 * 2;
</script>
