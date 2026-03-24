<script setup lang="ts">
import { ref } from 'vue'
import type { TreeDataNode, Key } from '../types'

const treeData: TreeDataNode[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
    ],
  },
]

const expandedKeys = ref<Key[]>(['0-0-0', '0-0-1'])

function onContextMenuClick(treeKey: Key, menuKey: string | number) {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`)
}
</script>

<template>
  <a-tree v-model:expanded-keys="expandedKeys" :tree-data="treeData">
    <template #title="{ key: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']">
        <span>{{ title }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }: { key: string | number }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="1">1st menu item</a-menu-item>
            <a-menu-item key="2">2nd menu item</a-menu-item>
            <a-menu-item key="3">3rd menu item</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-tree>
</template>
