### for debug

<cn>
#### 基本
默认选中第一项。
</cn>

<us>
#### Nest
Default activate first tab.
</us>

```tpl
<template>
  <div>
    <a-select style="width: 200px" v-model="parentPos">
      <a-select-option v-for="pos in positionList" :key="pos" :value="pos"
        >Parent - {{pos}}</a-select-option
      >
    </a-select>

    <a-select style="width: 200px" v-model="childPos">
      <a-select-option v-for="pos in positionList" :key="pos" :value="pos"
        >Child - {{pos}}</a-select-option
      >
    </a-select>

    <a-select style="width: 200px" v-model="parentType">
      <a-select-option value="line">Parent - line</a-select-option>
      <a-select-option value="card">Parent - card</a-select-option>
    </a-select>

    <a-select style="width: 200px" v-model="childType">
      <a-select-option value="line">Child - line</a-select-option>
      <a-select-option value="card">Child - card</a-select-option>
    </a-select>

    <a-tabs defaultActiveKey="1" :tabPosition="parentPos" :type="parentType">
      <a-tab-pane tab="Tab 1" key="1">
        <a-tabs
          :defaultActiveKey="1"
          :tabPosition="childPos"
          :type="childType"
          style="height: 300px"
        >
          <a-tab-pane v-for="key in list" :tab="`Tab ${key}`" :key="key">TTTT {{key}}</a-tab-pane>
        </a-tabs>
      </a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2">Content of Tab Pane 2</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  const positionList = ['left', 'right', 'top', 'bottom'];
  const list = new Array(20).fill().map((_, index) => index);
  export default {
    data() {
      return {
        positionList,
        list,
        parentPos: undefined,
        childPos: undefined,
        parentType: undefined,
        childType: undefined,
      };
    },
  };
</script>
```
