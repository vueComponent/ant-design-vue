<docs>
---
order: 5
title:
  zh-CN: 连接线
  en-US: Tree With Line
---

## zh-CN

节点之间带连接线的树，常用于文件目录结构展示。使用 `showLine` 开启，可以用 `switcherIcon` 修改默认图标。

## en-US

Tree with connected line between nodes, turn on by `showLine`, customize the preseted icon by `switcherIcon`.

</docs>

<template>
  <div>
    <div style="margin-bottom: 16px">
      showLine:
      <a-switch v-model:checked="showLine" />
      <br />
      <br />
      showIcon:
      <a-switch v-model:checked="showIcon" />
    </div>
    <a-tree
      :show-line="showLine"
      :show-icon="showIcon"
      :default-expanded-keys="['0-0-0']"
      :tree-data="treeData"
      @select="onSelect"
    >
      <template #icon><carry-out-outlined /></template>
      <template #title="{ dataRef }">
        <template v-if="dataRef.key === '0-0-0-1'">
          <div>multiple line title</div>
          <div>multiple line title</div>
        </template>
        <template v-else>{{ dataRef.title }}</template>
      </template>
      <template #switcherIcon="{ dataRef, defaultIcon }">
        <SmileTwoTone v-if="dataRef.key === '0-0-2'" />
        <component :is="defaultIcon" v-else />
      </template>
    </a-tree>
  </div>
</template>
<script lang="ts">
import { CarryOutOutlined, SmileTwoTone } from '@ant-design/icons-vue';
import type { TreeProps } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    CarryOutOutlined,
    SmileTwoTone,
  },
  setup() {
    const showLine = ref<boolean>(true);
    const showIcon = ref<boolean>(false);
    const treeData = ref<TreeProps['treeData']>([
      {
        title: 'parent 1',
        key: '0-0',
        children: [
          {
            title: 'parent 1-0',
            key: '0-0-0',
            children: [
              { title: 'leaf', key: '0-0-0-0' },
              {
                key: '0-0-0-1',
              },
              { title: 'leaf', key: '0-0-0-2' },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [{ title: 'leaf', key: '0-0-1-0' }],
          },
          {
            title: 'parent 1-2',
            key: '0-0-2',
            children: [
              { title: 'leaf 1', key: '0-0-2-0' },
              {
                title: 'leaf 2',
                key: '0-0-2-1',
              },
            ],
          },
        ],
      },
      {
        title: 'parent 2',
        key: '0-1',
        children: [
          {
            title: 'parent 2-0',
            key: '0-1-0',
            children: [
              { title: 'leaf', key: '0-1-0-0' },
              { title: 'leaf', key: '0-1-0-1' },
            ],
          },
        ],
      },
    ]);
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    };
    return {
      showLine,
      showIcon,
      onSelect,
      treeData,
    };
  },
});
</script>
