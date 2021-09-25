<docs>
---
order: 2
title:
  zh-CN: 白底模式
  en-US: white background mode
---

## zh-CN

默认 PageHeader 是透明底色的。在某些情况下，PageHeader 需要自己的背景颜色。

## en-US

The default PageHeader is a transparent background. In some cases, PageHeader needs its own background color.

</docs>

<template>
  <div class="demo-page-header" style="background-color: #f5f5f5; padding: 24px">
    <a-page-header
      :ghost="false"
      title="Title"
      sub-title="This is a subtitle"
      @back="() => $router.go(-1)"
    >
      <template #extra>
        <a-button key="3">Operation</a-button>
        <a-button key="2">Operation</a-button>
        <a-button key="1" type="primary">Primary</a-button>
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="Created">Lili Qu</a-descriptions-item>
        <a-descriptions-item label="Association">
          <a>421421</a>
        </a-descriptions-item>
        <a-descriptions-item label="Creation Time">2017-01-10</a-descriptions-item>
        <a-descriptions-item label="Effective Time">2017-10-10</a-descriptions-item>
        <a-descriptions-item label="Remarks">
          Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </div>
</template>
<style scoped>
.demo-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>
