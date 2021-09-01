<template>
  <demo-sort>
    <basic />
    <placement />
    <render-in-current />
    <form-in-drawer />
    <user-profile />
    <multi-level-drawer />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Placement from './placement.vue';
import UserProfile from './user-profile.vue';
import MultiLevelDrawer from './multi-level-drawer.vue';
import FormInDrawer from './form-in-drawer.vue';
import RenderInCurrent from './render-in-current.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Placement,
    UserProfile,
    MultiLevelDrawer,
    FormInDrawer,
    RenderInCurrent,
  },
  setup() {
    return {};
  },
});
</script>
