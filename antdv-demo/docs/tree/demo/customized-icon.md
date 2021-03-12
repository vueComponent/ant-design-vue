<cn>
#### 自定义图标
可以针对不同的节点定制图标。
</cn>

<us>
#### Customize Icon
You can customize icons for different nodes.
</us>

```vue
<template>
  <a-tree :tree-data="treeData" show-icon default-expand-all :default-selected-keys="['0-0-0']">
    <a-icon slot="switcherIcon" type="down" />
    <a-icon slot="smile" type="smile-o" />
    <a-icon slot="meh" type="smile-o" />
    <template slot="custom" slot-scope="{ selected }">
      <a-icon :type="selected ? 'frown' : 'frown-o'" />
    </template>
  </a-tree>
</template>
<script>
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    slots: {
      icon: 'smile',
    },
    children: [
      { title: 'leaf', key: '0-0-0', slots: { icon: 'meh' } },
      { title: 'leaf', key: '0-0-1', scopedSlots: { icon: 'custom' } },
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
```
