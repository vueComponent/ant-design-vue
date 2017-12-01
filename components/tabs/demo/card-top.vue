<template>
  <div class="card-container">
    <Tabs type="card">
      <TabPane tab="Tab Title 1" tabKey="1">
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </TabPane>
      <TabPane tab="Tab Title 2" tabKey="2">
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </TabPane>
      <TabPane tab="Tab Title 3" tabKey="3">
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { Tabs } from 'antd'
export default {
  data () {
    return {
    }
  },
  methods: {
    callback (key) {
      console.log(key)
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
  },
}
</script>
<style>
.card-container {
  background: #F5F5F5;
  overflow: hidden;
  padding: 24px;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
