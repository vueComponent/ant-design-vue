<template>
  <demo-sort>
    <Basic />
    <NoWapper />
    <Overflow />
    <Dot />
    <Status />
    <Change />
    <Title />
    <Colors />
    <Ribbon />
    <Link />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import NoWapper from './no-wrapper.vue';
import Dot from './dot.vue';
import Change from './change.vue';
import Overflow from './overflow.vue';
import Status from './status.vue';
import Title from './title.vue';
import Colors from './colors.vue';
import Link from './link.vue';
import Ribbon from './ribbon.vue';
import CN from './../index.zh-CN.md';
import US from './../index.en_US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    NoWapper,
    Overflow,
    Dot,
    Status,
    Change,
    Title,
    Colors,
    Link,
    Ribbon,
  },
});
</script>

<style>
[id^='components-badge-demo-'] .ant-badge:not(.ant-badge-not-a-wrapper) {
  margin-right: 20px;
}
[id^='components-badge-demo-'] .head-example {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  background: #eee;
  display: inline-block;
  vertical-align: middle;
}
[id^='components-badge-demo-'] .ant-badge-not-a-wrapper:not(.ant-badge-status) {
  margin-right: 8px;
}
</style>
