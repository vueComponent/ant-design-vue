<template>
<div>
  <md>
  ## 带页签的卡片
  </md>
  <div>
    <Card
      style="width:100%"
      title="Card title"
      :tabList="tabList"
      @tabChange="key => onTabChange(key, 'key')"
    >
      <a href="#" slot="extra">More</a>
      {{contentList[key]}}
    </Card>
    <br /><br />
    <Card
      style="width:100%"
      :tabList="tabListNoTitle"
      @tabChange="key => onTabChange(key, 'noTitleKey')"
    >
      <div v-html="contentListNoTitle[noTitleKey]"></div>
    </Card>
  </div>
</div>
</template>

<script>
import '../style'
import { Card } from 'antd'
export default {
  data () {
    return {
      tabList: [{
        key: 'tab1',
        tab: 'tab1',
      }, {
        key: 'tab2',
        tab: 'tab2',
      }],
      contentList: {
        tab1: 'content1',
        tab2: 'content2',
      },
      tabListNoTitle: [{
        key: 'article',
        tab: 'article',
      }, {
        key: 'app',
        tab: 'app',
      }, {
        key: 'project',
        tab: 'project',
      }],
      contentListNoTitle: {
        article: '<p>article content</p>',
        app: '<p>app content</p>',
        project: '<p>project content</p>',
      },
      key: 'tab1',
      noTitleKey: 'article',
    }
  },
  methods: {
    onTabChange (key, type) {
      console.log(key, type)
      this[type] = key
    },
  },
  components: {
    Card,
  },
}
</script>
