<cn>
#### 异步加载
异步加载树节点。
</cn>

<us>
#### Asynchronous loading
Asynchronous loading tree node.
</us>

```vue
<template>
  <a-tree-select
    v-model="value"
    tree-data-simple-mode
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="Please select"
    :load-data="onLoadData"
  />
</template>

<script>
export default {
  data() {
    return {
      value: undefined,
      treeData: [
        { id: 1, pId: 0, value: '1', title: 'Expand to load' },
        { id: 2, pId: 0, value: '2', title: 'Expand to load' },
        { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
      ],
    };
  },
  watch: {
    value(value) {
      console.log(value);
    },
  },
  methods: {
    genTreeNode(parentId, isLeaf = false) {
      const random = Math.random()
        .toString(36)
        .substring(2, 6);
      return {
        id: random,
        pId: parentId,
        value: random,
        title: isLeaf ? 'Tree Node' : 'Expand to load',
        isLeaf,
      };
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        const { id } = treeNode.dataRef;
        setTimeout(() => {
          this.treeData = this.treeData.concat([
            this.genTreeNode(id, false),
            this.genTreeNode(id, true),
          ]);
          resolve();
        }, 300);
      });
    },
  },
};
</script>
```
