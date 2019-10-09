<cn>
#### 多层抽屉
在抽屉内打开新的抽屉，用以解决多分支任务的复杂状况。
</cn>

<us>
#### Multi-level drawer
Open a new drawer on top of an existing drawer to handle multi branch tasks
</us>

```tpl
<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>
    <a-drawer
      title="Multi-level drawer"
      width="520"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <a-button type="primary" @click="showChildrenDrawer">
        Two-level drawer
      </a-button>
      <a-drawer
        title="Two-level Drawer"
        width="320"
        :closable="false"
        @close="onChildrenDrawerClose"
        :visible="childrenDrawer"
      >
        <a-button type="primary" @click="showChildrenDrawer">
          This is two-level drawer
        </a-button>
      </a-drawer>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="marginRight: 8px" @click="onClose">
          Cancel
        </a-button>
        <a-button @click="onClose" type="primary">
          Submit
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        childrenDrawer: false,
      };
    },
    methods: {
      showDrawer() {
        this.visible = true;
      },
      onClose() {
        this.visible = false;
      },
      showChildrenDrawer() {
        this.childrenDrawer = true;
      },
      onChildrenDrawerClose() {
        this.childrenDrawer = false;
      },
    },
  };
</script>
```
