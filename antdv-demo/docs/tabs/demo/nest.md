<cn>
#### 基本
默认选中第一项。
</cn>

<us>
#### Nest
Default activate first tab.
</us>

```vue
<template>
  <div>
    <a-select v-model="parentPos" style="width: 200px">
      <a-select-option v-for="pos in positionList" :key="pos" :value="pos">
        Parent - {{ pos }}
      </a-select-option>
    </a-select>
    <a-select v-model="childPos" style="width: 200px">
      <a-select-option v-for="pos in positionList" :key="pos" :value="pos">
        Child - {{ pos }}
      </a-select-option>
    </a-select>

    <a-select v-model="parentType" style="width: 200px">
      <a-select-option value="line">
        Parent - line
      </a-select-option>
      <a-select-option value="card">
        Parent - card
      </a-select-option>
    </a-select>

    <a-select v-model="childType" style="width: 200px">
      <a-select-option value="line">
        Child - line
      </a-select-option>
      <a-select-option value="card">
        Child - card
      </a-select-option>
    </a-select>

    <a-tabs default-active-key="1" :tab-position="parentPos" :type="parentType">
      <a-tab-pane key="1" tab="Tab 1">
        <a-tabs
          :default-active-key="1"
          :tab-position="childPos"
          :type="childType"
          style="height: 300px"
        >
          <a-tab-pane v-for="key in list" :key="key" :tab="`Tab ${key}`">
            TTTT {{ key }}
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">
        Content of Tab Pane 2
      </a-tab-pane>
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
