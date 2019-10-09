<cn>
#### 连接线
带连接线的树。
</cn>

<us>
#### Tree With Line
Tree With Line
</us>

```tpl
<template>
  <a-tree showLine :defaultExpandedKeys="['0-0-0']" @select="onSelect">
    <a-tree-node key="0-0">
      <span slot="title" style="color: #1890ff">parent 1</span>
      <a-tree-node title="parent 1-0" key="0-0-0">
        <a-tree-node title="leaf" key="0-0-0-0" />
        <a-tree-node title="leaf" key="0-0-0-1" />
        <a-tree-node title="leaf" key="0-0-0-2" />
      </a-tree-node>
      <a-tree-node title="parent 1-1" key="0-0-1">
        <a-tree-node title="leaf" key="0-0-1-0" />
      </a-tree-node>
      <a-tree-node title="parent 1-2" key="0-0-2">
        <a-tree-node title="leaf" key="0-0-2-0" />
        <a-tree-node title="leaf" key="0-0-2-1" />
      </a-tree-node>
    </a-tree-node>
  </a-tree>
</template>

<script>
  export default {
    methods: {
      onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
      },
    },
  };
</script>
```
