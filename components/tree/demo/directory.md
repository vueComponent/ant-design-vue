<cn>
#### 目录
内置的目录树，`multiple` 模式支持 `ctrl(Windows)` / `command(Mac)` 复选。
</cn>

<us>
#### Directory
Built-in directory tree. `multiple` support `ctrl(Windows)` / `command(Mac)` selection.
</us>

```tpl
<template>
  <a-directory-tree multiple defaultExpandAll @select="onSelect" @expand="onExpand">
    <a-tree-node title="parent 0" key="0-0">
      <a-tree-node title="leaf 0-0" key="0-0-0" isLeaf />
      <a-tree-node title="leaf 0-1" key="0-0-1" isLeaf />
    </a-tree-node>
    <a-tree-node title="parent 1" key="0-1">
      <a-tree-node title="leaf 1-0" key="0-1-0" isLeaf />
      <a-tree-node title="leaf 1-1" key="0-1-1" isLeaf />
    </a-tree-node>
  </a-directory-tree>
</template>
<script>
  export default {
    methods: {
      onSelect(keys) {
        console.log('Trigger Select', keys);
      },
      onExpand() {
        console.log('Trigger Expand');
      },
    },
  };
</script>
```
