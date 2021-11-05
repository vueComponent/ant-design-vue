<template>
  <demo-sort>
    <basic />
    <draggable />
    <dynamic />
    <custom-icon />
    <search />
    <show-line />
    <directory />
    <switcher-icon />
    <replace-fields />
    <context-menu />
    <virtual-scroll />
    <accordion />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Draggable from './draggable.vue';
import Dynamic from './dynamic.vue';
import Search from './search.vue';
import Line from './line.vue';
import CustomIcon from './customized-icon.vue';
import Directory from './directory.vue';
import SwitcherIcon from './switcher-icon.vue';
import ReplaceFields from './replaceFields.vue';
import ContextMenu from './context-menu.vue';
import VirtualScroll from './virtual-scroll.vue';
import Accordion from './accordion.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Draggable,
    Dynamic,
    Search,
    ShowLine: Line,
    CustomIcon,
    Directory,
    SwitcherIcon,
    ReplaceFields,
    ContextMenu,
    VirtualScroll,
    Accordion,
  },
  setup() {
    return {};
  },
});
</script>
