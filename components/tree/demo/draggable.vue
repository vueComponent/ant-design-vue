<docs>
---
order: 2
title:
  zh-CN: 拖动示例
  en-US: draggable
---

## zh-CN

将节点拖拽到其他节点内部或前后。

## en-US

Drag treeNode to insert after the other treeNode or insert into the other parent TreeNode.

</docs>
<template>
  <a-tree
    class="draggable-tree"
    draggable
    block-node
    :tree-data="gData"
    @dragenter="onDragEnter"
    @drop="onDrop"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import type {
  AntTreeNodeDragEnterEvent,
  AntTreeNodeDropEvent,
  TreeProps,
} from 'ant-design-vue/es/tree';

const x = 3;
const y = 2;
const z = 1;
const genData = [];

const generateData = (_level: number, _preKey?: string, _tns?: TreeProps['treeData']) => {
  const preKey = _preKey || '0';
  const tns = _tns || genData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);
type TreeDataItem = TreeProps['treeData'][number];
export default defineComponent({
  setup() {
    const expandedKeys = ref<(string | number)[]>(['0-0', '0-0-0', '0-0-0-0']);
    const gData = ref<TreeProps['treeData']>(genData);
    const onDragEnter = (info: AntTreeNodeDragEnterEvent) => {
      console.log(info);
      // expandedKeys 需要展开时
      // expandedKeys.value = info.expandedKeys;
    };

    const onDrop = (info: AntTreeNodeDropEvent) => {
      console.log(info);
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data: TreeProps['treeData'], key: string | number, callback: any) => {
        data.forEach((item, index) => {
          if (item.key === key) {
            return callback(item, index, data);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...gData.value];

      // Find dragObject
      let dragObj: TreeDataItem;
      loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item: TreeDataItem) => {
          item.children = item.children || [];
          /// where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item: TreeDataItem) => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar: TreeProps['treeData'] = [];
        let i = 0;
        loop(data, dropKey, (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      gData.value = data;
    };
    return {
      expandedKeys,
      gData,
      onDragEnter,
      onDrop,
    };
  },
});
</script>
