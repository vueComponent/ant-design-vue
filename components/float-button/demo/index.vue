<template>
  <template v-if="iframeName === 'basic-usage'">
    <basic></basic>
  </template>
  <template v-else-if="iframeName === 'type'">
    <type></type>
  </template>
  <template v-else-if="iframeName === 'shape'">
    <shape></shape>
  </template>
  <template v-else-if="iframeName === 'description'">
    <description></description>
  </template>
  <template v-else-if="iframeName === 'floatbutton-with-tooltip'">
    <tooltip></tooltip>
  </template>
  <template v-else-if="iframeName === 'floatbutton-group'">
    <group></group>
  </template>
  <template v-else-if="iframeName === 'menu-mode'">
    <group-menu></group-menu>
  </template>
  <template v-else-if="iframeName === 'backtop'">
    <back-top></back-top>
  </template>
  <template v-else-if="iframeName === 'badge'">
    <badge></badge>
  </template>
  <demo-sort v-else>
    <basic></basic>
    <type></type>
    <shape></shape>
    <description></description>
    <tooltip></tooltip>
    <group></group>
    <group-menu></group-menu>
    <back-top></back-top>
    <badge></badge>
  </demo-sort>
</template>

<script lang="ts">
import Basic from './basic.vue';
import Type from './type.vue';
import Shape from './shape.vue';
import Description from './description.vue';
import Tooltip from './tooltip.vue';
import group from './group.vue';
import GroupMenu from './group-menu.vue';
import BackTop from './back-top.vue';
import Badge from './badge.vue';

import { defineComponent, provide } from 'vue';
import US from '../index.en-US.md';
import CN from '../index.zh-CN.md';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Type,
    Shape,
    Description,
    Tooltip,
    group,
    GroupMenu,
    BackTop,
    Badge,
  },
  props: {
    iframeName: String,
  },
  setup(props) {
    provide(
      'iframeDemo',
      !props.iframeName
        ? {
            type: '/iframe/float-button/#type',
            'basic-usage': '/iframe/float-button/#basic-usage',
            shape: '/iframe/float-button/#shape',
            description: '/iframe/float-button/#description',
            'floatbutton-with-tooltip': '/iframe/float-button/#floatbutton-with-tooltip',
            'floatbutton-group': '/iframe/float-button/#floatbutton-group',
            'menu-mode': '/iframe/float-button/#menu-mode',
            backtop: '/iframe/float-button/#backtop',
            badge: '/iframe/float-button/#badge',
          }
        : {},
    );
  },
});
</script>
