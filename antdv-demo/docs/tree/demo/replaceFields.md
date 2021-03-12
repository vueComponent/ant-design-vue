<cn>
#### 自定义TreeNode字段
替换treeNode中 title,key,children字段为treeData中对应的字段
</cn>

<us>
#### ReplaceFields
Replace the title,key and children fields in treeNode with the corresponding fields in treeData.
</us>

```vue
<template>
  <a-tree
    checkable
    :tree-data="treeData"
    :default-expanded-keys="['0-0-0', '0-0-1']"
    :default-selected-keys="['0-0-0', '0-0-1']"
    :default-checked-keys="['0-0-0', '0-0-1']"
    :replace-fields="replaceFields"
    @select="onSelect"
    @check="onCheck"
  />
</template>
<script>
const treeData = [
  {
    name: 'parent 1',
    key: '0-0',
    child: [
      {
        name: '张晨成',
        key: '0-0-0',
        disabled: true,
        child: [
          { name: 'leaf', key: '0-0-0-0', disableCheckbox: true },
          { name: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        name: 'parent 1-1',
        key: '0-0-1',
        child: [{ key: '0-0-1-0', name: 'zcvc' }],
      },
    ],
  },
];

export default {
  data() {
    return {
      treeData,
      replaceFields: {
        children: 'child',
        title: 'name',
      },
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
