<cn>
#### 自定义新增页签触发器
隐藏默认的页签增加图标，给自定义触发器绑定事件。
</cn>

<us>
#### Customized trigger of new tab
Hide default plus icon, and bind event for customized trigger.
</us>

```tpl
<template>
  <div>
    <div :style="{ marginBottom: '16px' }">
      <a-button @click="add">ADD</a-button>
    </div>
    <a-tabs hideAdd v-model="activeKey" type="editable-card" @edit="onEdit">
      <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
        {{pane.content}}
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      const panes = [
        { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
        { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
      ];
      return {
        activeKey: panes[0].key,
        panes,
        newTabIndex: 0,
      };
    },
    methods: {
      callback(key) {
        console.log(key);
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      add() {
        const panes = this.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({
          title: `New Tab ${activeKey}`,
          content: `Content of new Tab ${activeKey}`,
          key: activeKey,
        });
        this.panes = panes;
        this.activeKey = activeKey;
      },
      remove(targetKey) {
        let activeKey = this.activeKey;
        let lastIndex;
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.panes = panes;
        this.activeKey = activeKey;
      },
    },
  };
</script>
```
