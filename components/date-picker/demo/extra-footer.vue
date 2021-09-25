<docs>
---
order: 7
title:
  zh-CN: 额外的页脚
  en-US: Extra Footer
---

## zh-CN

在浮层中加入额外的页脚，以满足某些定制信息的需求。

## en-US

Render extra footer in panel for customized requirements.

</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker>
      <template #renderExtraFooter>extra footer</template>
    </a-date-picker>
    <a-date-picker show-time>
      <template #renderExtraFooter>extra footer</template>
    </a-date-picker>
    <a-range-picker>
      <template #renderExtraFooter>extra footer</template>
    </a-range-picker>
    <a-range-picker show-time>
      <template #renderExtraFooter>extra footer</template>
    </a-range-picker>
    <a-date-picker placeholder="Select month" picker="month">
      <template #renderExtraFooter>extra footer</template>
    </a-date-picker>
  </a-space>
</template>
