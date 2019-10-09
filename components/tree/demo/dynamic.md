<cn>
#### 异步数据加载
点击展开节点，动态加载数据。
</cn>

<us>
#### load data asynchronously
To load data asynchronously when click to expand a treeNode.
</us>

```tpl
<template>
  <a-tree :loadData="onLoadData" :treeData="treeData" />
</template>

<script>
  export default {
    data() {
      return {
        treeData: [
          { title: 'Expand to load', key: '0' },
          { title: 'Expand to load', key: '1' },
          { title: 'Tree Node', key: '2', isLeaf: true },
        ],
      };
    },
    methods: {
      onLoadData(treeNode) {
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve();
            return;
          }
          setTimeout(() => {
            treeNode.dataRef.children = [
              { title: 'Child Node', key: `${treeNode.eventKey}-0` },
              { title: 'Child Node', key: `${treeNode.eventKey}-1` },
            ];
            this.treeData = [...this.treeData];
            resolve();
          }, 1000);
        });
      },
    },
  };
</script>
```
