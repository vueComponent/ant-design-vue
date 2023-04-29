<docs>
---
order: 3
title:
  zh-CN: 倒计时
  en-US: Countdown
---

## zh-CN

倒计时组件。

## en-US

Countdown component.

</docs>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic-countdown
        title="Countdown"
        :value="deadline"
        style="margin-right: 50px"
        @finish="onFinish"
      />
    </a-col>
    <a-col :span="12">
      <a-statistic-countdown
        title="Million Seconds"
        :value="deadline"
        format="HH:mm:ss:SSS"
        style="margin-right: 50px"
      />
    </a-col>
    <a-col :span="24" style="margin-top: 32px">
      <a-statistic-countdown title="Day Level" :value="deadline" format="D 天 H 时 m 分 s 秒" />
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
const onFinish = () => {
  console.log('finished!');
};
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
</script>
