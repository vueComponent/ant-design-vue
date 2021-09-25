<docs>
---
order: 5
title: 
  zh-CN: 垂直带边框的
  en-US: Vertical Border
---

## zh-CN

垂直带边框和背景颜色的列表。

## en-US

Descriptions with border and background color.

</docs>

<template>
  <a-descriptions title="User Info" layout="vertical" bordered>
    <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
    <a-descriptions-item label="Billing Mode">Prepaid</a-descriptions-item>
    <a-descriptions-item label="Automatic Renewal">YES</a-descriptions-item>
    <a-descriptions-item label="Order time">2018-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="Usage Time" :span="2">2019-04-24 18:00:00</a-descriptions-item>
    <a-descriptions-item label="Status" :span="3">
      <a-badge status="processing" text="Running" />
    </a-descriptions-item>
    <a-descriptions-item label="Negotiated Amount">$80.00</a-descriptions-item>
    <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
    <a-descriptions-item label="Official Receipts">$60.00</a-descriptions-item>
    <a-descriptions-item label="Config Info">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1
      <br />
    </a-descriptions-item>
  </a-descriptions>
</template>
