<cn>
#### 列表
在列表组件中使用加载占位符。
</cn>

<us>
#### List
Use skeleton in list component.
</us>

```tpl
<template>
  <div>
    <a-switch :checked="!loading" @change="onChange" />

    <a-list itemLayout="vertical" size="large" :dataSource="listData">
      <a-list-item slot="renderItem" slot-scope="item, index" key="item.title">
        <template v-if="!loading" slot="actions" v-for="{type, text} in actions">
          <span :key="type">
            <a-icon :type="type" style="margin-right: 8px" />
            {{text}}
          </span>
        </template>
        <img
          v-if="!loading"
          slot="extra"
          width="272"
          alt="logo"
          src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
        />
        <a-skeleton :loading="loading" active avatar>
          <a-list-item-meta :description="item.description">
            <a slot="title" :href="item.href">{{item.title}}</a>
            <a-avatar slot="avatar" :src="item.avatar" />
          </a-list-item-meta>
          {{item.content}}
        </a-skeleton>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
  const listData = [];
  for (let i = 0; i < 3; i++) {
    listData.push({
      href: 'https://vue.ant.design/',
      title: `ant design vue part ${i}`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }
  export default {
    data() {
      return {
        loading: true,
        listData,
        actions: [
          { type: 'star-o', text: '156' },
          { type: 'like-o', text: '156' },
          { type: 'message', text: '2' },
        ],
      };
    },
    methods: {
      onChange(checked) {
        this.loading = !checked;
      },
    },
  };
</script>
<style>
  .skeleton-demo {
    border: 1px solid #f4f4f4;
  }
</style>
```
