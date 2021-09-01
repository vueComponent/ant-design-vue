<template>
  <demo-sort>
    <Basic />
    <BorderLess />
    <FlexibleContent />
    <GridCard />
    <InColumn />
    <Inner />
    <Loading />
    <Meta />
    <Simple />
    <Tabs />
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import BorderLess from './border-less.vue';
import FlexibleContent from './flexible-content.vue';
import GridCard from './grid-card.vue';
import InColumn from './in-column.vue';
import Inner from './inner.vue';
import Loading from './loading.vue';
import Meta from './meta.vue';
import Simple from './simple.vue';
import Tabs from './tabs.vue';

import CN from './../index.zh-CN.md';
import US from './../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    BorderLess,
    FlexibleContent,
    GridCard,
    InColumn,
    Inner,
    Loading,
    Meta,
    Simple,
    Tabs,
  },
});
</script>
