<cn>
#### 自定义渲染行数据
自定义渲染每一个 Transfer Item，可用于渲染复杂数据。
</cn>

<us>
#### Custom datasource
Custom each Transfer Item, and in this way you can render a complex datasource.
</us>

```tpl
<template>
  <a-transfer
    :dataSource="mockData"
    :listStyle="{
      width: '300px',
      height: '300px',
    }"
    :targetKeys="targetKeys"
    @change="handleChange"
    :render="renderItem"
  >
  </a-transfer>
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
        for (let i = 0; i < 20; i++) {
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
      renderItem(item) {
        const customLabel = (
          <span class="custom-item">
            {item.title} - {item.description}
          </span>
        );

        return {
          label: customLabel, // for displayed item
          value: item.title, // for title and filter matching
        };
      },
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys;
      },
    },
  };
</script>
```
