<cn>
#### 基本用法
最简单的用法，展示可勾选，可选中，禁用，默认展开等功能。
</cn>

<us>
#### Basic
The most basic usage, tell you how to use checkable, selectable, disabled, defaultExpandKeys, and etc.
</us>

```tpl
<template>
  <a-tree
    checkable
    :treeData="treeData"
    :defaultExpandedKeys="['0-0-0', '0-0-1']"
    :defaultSelectedKeys="['0-0-0', '0-0-1']"
    :defaultCheckedKeys="['0-0-0', '0-0-1']"
    @select="this.onSelect"
    @check="this.onCheck"
  >
    <span slot="title0010" style="color: #1890ff">sss</span>
  </a-tree>
</template>
<script>
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
            { title: 'leaf', key: '0-0-0-1' },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [{ key: '0-0-1-0', slots: { title: 'title0010' } }],
        },
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
