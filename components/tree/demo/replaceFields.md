<cn>
#### 自定义TreeNode字段
替换treeNode中 title,key,children字段为treeData中对应的字段
</cn>

<us>
#### ReplaceFields
Replace the title,key and children fields in treeNode with the corresponding fields in treeData.
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
    :replaceFields="replaceFields"/>
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
          child: [{ key: '0-0-1-0', name:'zcvc' }],
        },
      ],
    },
  ];

  export default {
    data() {
      return {
        treeData,
        replaceFields:{
        children:'child',
        title:'name'
        }
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
