<template>
  <div>
    <a-radio-group v-model:value="mode" style="margin-bottom: 8px">
      <a-radio-button value="top">Horizontal</a-radio-button>
      <a-radio-button value="left">Vertical</a-radio-button>
    </a-radio-group>
    <a-tabs
      v-model:active-key="activeKey"
      :tab-position="mode"
      :style="{ height: '200px' }"
    >
      <a-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`">
        Content of tab {{ i }}
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabPosition } from '../types'

const mode = ref<TabPosition>('top')
const activeKey = ref(1)
</script>
