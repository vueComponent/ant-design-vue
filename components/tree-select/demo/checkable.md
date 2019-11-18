<cn>
#### 可勾选
使用勾选框实现多选功能。
</cn>

<us>
#### Checkable
Multiple and checkable.
</us>

```tpl
<template>
  <a-tree-select
    style="width: 300px"
    :treeData="treeData"
    :value="value"
    @change="onChange"
    treeCheckable
    :showCheckedStrategy="SHOW_PARENT"
    searchPlaceholder="Please select"
  />
</template>

<script>
  import { TreeSelect } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;

  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-0',
          key: '0-0-0',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
      children: [
        {
          title: 'Child Node3',
          value: '0-1-0',
          key: '0-1-0',
          disabled: true,
        },
        {
          title: 'Child Node4',
          value: '0-1-1',
          key: '0-1-1',
        },
        {
          title: 'Child Node5',
          value: '0-1-2',
          key: '0-1-2',
        },
      ],
    },
  ];
  export default {
    data() {
      return {
        value: ['0-0-0'],
        treeData,
        SHOW_PARENT,
      };
    },
    methods: {
      onChange(value) {
        console.log('onChange ', value);
        this.value = value;
      },
    },
  };
</script>
```
