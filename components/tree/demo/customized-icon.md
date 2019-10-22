<cn>
#### 自定义图标
可以针对不同的节点定制图标。
</cn>

<us>
#### Customize Icon
You can customize icons for different nodes.
</us>

```tpl
<template>
  <a-tree :treeData="treeData" showIcon defaultExpandAll :defaultSelectedKeys="['0-0-0']">
    <a-icon type="down" slot="switcherIcon" />
    <a-icon slot="smile" type="smile-o" />
    <a-icon slot="meh" type="smile-o" />
    <template slot="custom" slot-scope="{selected}">
      <a-icon :type="selected ? 'frown':'frown-o'" />
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
