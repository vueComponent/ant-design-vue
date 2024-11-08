<docs>
---
order: 5
title:
  zh-CN: 一次性密码框。
  en-US: One time password input.
---

## zh-CN

一次性密码输入框。

## en-US

One time password input.
</docs>

<template>
  <a-flex gap="middle" align="flex-start" vertical>
    <a-typography-title :level="5">With formatter (Upcase)</a-typography-title>
    <a-OTP :formatter="str => str.toUpperCase()" @Change="handleChange" />
    <ATypographyTitle :level="5">With Disabled</ATypographyTitle>
    <a-OTP disabled @Change="handleChange" />
    <ATypographyTitle :level="5">With Length (8)</ATypographyTitle>
    <a-OTP :length="8" @Change="handleChange" />
    <ATypographyTitle :level="5">With custom display character</ATypographyTitle>
    <a-OTP mask="🔒" @Change="handleChange" />
  </a-flex>
</template>
<script setup lang="ts">
const handleChange = (text: string) => {
  console.log('onChange:', text);
};
</script>
