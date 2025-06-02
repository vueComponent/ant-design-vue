<docs>
---
order: 4
title: 
  zh-CN: 自定义描述文案 
  en-US: Customized description
---

## zh-CN

自定义描述文案。

## en-US

Customized description content.

</docs>

<template>
  <a-flex gap="middle" vertical>
    <a-flex gap="middle">
      <a-spin tip="Loading" size="small">
        <div style="padding: 50px; background: rgba(0, 0, 0, 0.05); border-radius: 4px"></div>
      </a-spin>
      <a-spin tip="Loading">
        <div style="padding: 50px; background: rgba(0, 0, 0, 0.05); border-radius: 4px"></div>
      </a-spin>
      <a-spin tip="Loading" size="large">
        <div style="padding: 50px; background: rgba(0, 0, 0, 0.05); border-radius: 4px"></div>
      </a-spin>
    </a-flex>
    <a-spin tip="Loading...">
      <a-alert
        message="Alert message title"
        description="Further details about the context of this alert."
      ></a-alert>
    </a-spin>
  </a-flex>
</template>
