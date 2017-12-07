<template>
<div>
    <div :style="{ marginBottom: '16px' }">
      <AntButton @click="add">ADD</AntButton>
    </div>
    <Tabs
      hideAdd
      v-model="activeKey"
      type="editable-card"
      @edit="onEdit"
    >
    <TabPane v-for="pane in panes" :tab="pane.title" :key="pane.key" :tabKey="pane.key" :closable="pane.closable">
      {{pane.content}}
    </TabPane>
  </Tabs>
</div>

</template>
<script>
import { Tabs, Button } from 'antd'
export default {
  data () {
    const panes = [
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
    ]
    return {
      activeKey: panes[0].key,
      panes,
      newTabIndex: 0,
    }
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    add () {
      const panes = this.panes
      const activeKey = `newTab${this.newTabIndex++}`
      panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey })
      this.panes = panes
      this.activeKey = activeKey
    },
    remove (targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.key !== targetKey)
      if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = panes[lastIndex].key
      }
      this.panes = panes
      this.activeKey = activeKey
    },
  },
  components: {
    Tabs,
    TabPane: Tabs.TabPane,
    AntButton: Button,
  },
}
</script>
