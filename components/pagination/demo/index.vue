<template>
  <demo-sort :cols="1">
    <Basic />
    <More />
    <Changer />
    <CustomChanger />
    <Jump />
    <Mini />
    <Simple />
    <Total />
    <ItemRender />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import More from './more.vue';
import Changer from './changer.vue';
import CustomChanger from './custom-changer.vue';
import Jump from './jump.vue';
import Simple from './simple.vue';
import ItemRender from './itemRender.vue';
import Mini from './mini.vue';
import Total from './total.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    More,
    Changer,
    CustomChanger,
    Jump,
    Simple,
    Mini,
    Total,
    ItemRender,
  },
  setup() {
    return {};
  },
});
</script>
