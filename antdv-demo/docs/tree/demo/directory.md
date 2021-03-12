<cn>
#### 目录
内置的目录树，`multiple` 模式支持 `ctrl(Windows)` / `command(Mac)` 复选。
</cn>

<us>
#### Directory
Built-in directory tree. `multiple` support `ctrl(Windows)` / `command(Mac)` selection.
</us>

```vue
<template>
  <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
    <a-tree-node key="0-0" title="parent 0">
      <a-tree-node key="0-0-0" title="leaf 0-0" is-leaf />
      <a-tree-node key="0-0-1" title="leaf 0-1" is-leaf />
    </a-tree-node>
    <a-tree-node key="0-1" title="parent 1">
      <a-tree-node key="0-1-0" title="leaf 1-0" is-leaf />
      <a-tree-node key="0-1-1" title="leaf 1-1" is-leaf />
    </a-tree-node>
  </a-directory-tree>
</template>
<script>
export default {
  methods: {
    onSelect(keys, event) {
      console.log('Trigger Select', keys, event);
    },
    onExpand() {
      console.log('Trigger Expand');
    },
  },
};
</script>
```
