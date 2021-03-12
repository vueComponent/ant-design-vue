<template>
  <a-tree :tree-data="treeData" show-icon default-expand-all :default-selected-keys="['0-0-0']">
    <!-- <a-icon type="down" slot="switcherIcon" /> -->
    <!-- <template slot="switcherIcon" slot-scope="{ selected }">
      <a-icon :type="selected ? 'home' : 'user'" />
    </template> -->
    <a-icon slot="smile" type="smile-o" />
    <a-icon slot="meh" type="smile-o" />
    <template slot="custom" slot-scope="p">
      <a-icon :type="p.selected ? 'home' : 'user'" />
    </template>
  </a-tree>
</template>
<script>
/* eslint-disable no-console */
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    slots: {
      icon: 'smile',
    },
    scopedSlots: { switcherIcon: 'custom' },
    children: [
      { title: 'leaf', key: '0-0-0', slots: { icon: 'meh' } },
      { title: 'leaf1', key: '0-0-1', scopedSlots: { switcherIcon: 'custom' } },
    ],
  },
];

export default {
  data() {
    return {
      treeData,
    };
  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
    },
  },
};
</script>
