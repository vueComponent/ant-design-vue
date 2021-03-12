<cn>
#### 大数据性能测试
2000 条数据。
</cn>

<us>
#### Performance Test
2000 items.
</us>

```vue
<template>
  <a-transfer
    :data-source="mockData"
    :target-keys="targetKeys"
    :render="item => item.title"
    show-search
    @change="handleChange"
  />
</template>
<script>
export default {
  data() {
    return {
      mockData: [],
      targetKeys: [],
    };
  },
  mounted() {
    this.getMock();
  },
  methods: {
    getMock() {
      const targetKeys = [];
      const mockData = [];
      for (let i = 0; i < 2000; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1,
        };
        if (data.chosen) {
          targetKeys.push(data.key);
        }
        mockData.push(data);
      }
      this.mockData = mockData;
      this.targetKeys = targetKeys;
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys;
    },
  },
};
</script>
```
