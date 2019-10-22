<cn>
#### 高级用法
穿梭框高级用法，可配置操作文案，可定制宽高，可对底部进行自定义渲染。
</cn>

<us>
#### Advanced
You can customize the labels of the transfer buttons, the width and height of the columns, and what should be displayed in the footer.
</us>

```tpl
<template>
  <a-transfer
    :dataSource="mockData"
    showSearch
    :listStyle="{
      width: '250px',
      height: '300px',
    }"
    :operations="['to right', 'to left']"
    :targetKeys="targetKeys"
    @change="handleChange"
    :render="item=>`${item.title}-${item.description}`"
  >
    <a-button
      size="small"
      style="float:right;margin: 5px"
      @click="getMock"
      slot="footer"
      slot-scope="props"
    >
      reload
    </a-button>
    <span slot="notFoundContent">
      没数据
    </span>
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
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys;
      },
    },
  };
</script>
```
