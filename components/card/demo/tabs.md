<cn>
  #### 带页签的卡片
  可承载更多内容
</cn>

<us>
  #### With tabs
  More content can be hosted
</us>

```tpl
<template>
  <div>
    <a-card
      style="width:100%"
      title="Card title"
      :tabList="tabList"
      :activeTabKey="key"
      @tabChange="key => onTabChange(key, 'key')"
    >
      <span slot="customRender" slot-scope="item"> <a-icon type="home" />{{item.key}} </span>
      <a href="#" slot="extra">More</a>
      {{contentList[key]}}
    </a-card>
    <br /><br />
    <a-card
      style="width:100%"
      :tabList="tabListNoTitle"
      :activeTabKey="noTitleKey"
      @tabChange="key => onTabChange(key, 'noTitleKey')"
    >
      <p v-if="noTitleKey === 'article'">article content</p>
      <p v-else="noTitleKey === 'app'">app content</p>
      <p v-else="noTitleKey === 'project'">project content</p>
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabList: [
          {
            key: 'tab1',
            // tab: 'tab1',
            scopedSlots: { tab: 'customRender' },
          },
          {
            key: 'tab2',
            tab: 'tab2',
          },
        ],
        contentList: {
          tab1: 'content1',
          tab2: 'content2',
        },
        tabListNoTitle: [
          {
            key: 'article',
            tab: 'article',
          },
          {
            key: 'app',
            tab: 'app',
          },
          {
            key: 'project',
            tab: 'project',
          },
        ],
        key: 'tab1',
        noTitleKey: 'app',
      };
    },
    methods: {
      onTabChange(key, type) {
        console.log(key, type);
        this[type] = key;
      },
    },
  };
</script>
```
