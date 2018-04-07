<cn>
#### 基本用法
最基本的用法，展示了 `dataSource`、`targetKeys`、每行的渲染函数 `render` 以及回调函数 `change` `selectChange` `scroll` 的用法。
</cn>

<us>
#### Basic
The most basic usage of `Transfer` involves providing the source data and target keys arrays, plus the rendering and some callback functions.
</us>

```html
<template>
  <a-transfer
    :dataSource="mockData"
    :titles="['Source', 'Target']"
    :targetKeys="targetKeys"
    :selectedKeys="selectedKeys"
    @change="handleChange"
    @selectChange="handleSelectChange"
    @scroll="handleScroll"
    :render="item=>item.title"
  >
  </a-transfer>
</template>
<script>
export default {
  data () {
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1,
      });
    }

    const targetKeys = mockData
            .filter(item => +item.key % 3 > 1)
            .map(item => item.key);
    return {
      mockData,
      targetKeys,
      selectedKeys: ['1', '4'],
    }
  },
  methods: {
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys

      console.log('targetKeys: ', this.targetKeys);
      console.log('direction: ', direction);
      console.log('moveKeys: ', moveKeys);
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

      console.log('sourceSelectedKeys: ', sourceSelectedKeys);
      console.log('targetSelectedKeys: ', targetSelectedKeys);
    },
    handleScroll(direction, e) {
      console.log('direction:', direction);
      console.log('target:', e.target);
    },
  },
}
</script>
```

