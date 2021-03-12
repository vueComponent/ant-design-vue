<cn>
#### 栅格配置器
可以简单配置几种等分栅格和间距。
</cn>

<us>
#### Playground
A simple playground for column count and gutter.
</us>

```vue
<template>
  <div id="components-grid-demo-playground">
    <div style="margin-bottom:16px">
      <span style="margin-right:6px">Horizontal Gutter (px): </span>
      <div style="width:50%">
        <a-slider
          v-model="gutterKey"
          :min="0"
          :max="Object.keys(gutters).length - 1"
          :marks="gutters"
          :step="null"
        />
      </div>
      <span style="margin-right: 6px">Vertical Gutter (px): </span>
      <div style="width: 50%">
        <a-slider
          v-model="vgutterKey"
          :min="0"
          :max="Object.keys(vgutters).length - 1"
          :marks="vgutters"
          :step="null"
        />
      </div>
      <span style="margin-right:6px">Column Count:</span>
      <div style="width:50%">
        <a-slider
          v-model="colCountKey"
          :min="0"
          :max="Object.keys(colCounts).length - 1"
          :marks="colCounts"
          :step="null"
        />
      </div>
    </div>
    <a-row :gutter="[gutters[gutterKey], vgutters[vgutterKey]]">
      <a-col
        v-for="(item, index) in colCounts[colCountKey]"
        :key="item.toString()"
        :span="24 / colCounts[colCountKey]"
      >
        <div>Column</div>
      </a-col>
    </a-row>
    <a-row :gutter="[gutters[gutterKey], vgutters[vgutterKey]]">
      <a-col
        v-for="(item, index) in colCounts[colCountKey]"
        :key="item.toString()"
        :span="24 / colCounts[colCountKey]"
      >
        <div>Column</div>
      </a-col>
    </a-row>
    <pre v-text="rowColHtml" />
    <pre v-text="rowColHtml" />
  </div>
</template>
<script>
export default {
  data() {
    const gutters = {};
    const colCounts = {};
    const vgutters = {};
    [8, 16, 24, 32, 40, 48].forEach((value, i) => {
      gutters[i] = value;
    });
    [8, 16, 24, 32, 40, 48].forEach((value, i) => {
      vgutters[i] = value;
    });
    [2, 3, 4, 6, 8, 12].forEach((value, i) => {
      colCounts[i] = value;
    });
    return {
      gutterKey: 1,
      vgutterKey: 1,
      colCountKey: 2,
      colCounts,
      gutters,
      vgutters,
    };
  },
  computed: {
    rowColHtml() {
      const colCount = this.colCounts[this.colCountKey];
      const getter = [this.gutters[this.gutterKey], this.vgutters[this.vgutterKey]];
      let colCode = '<a-row :gutter="[' + getter + ']">\n';
      for (let i = 0; i < colCount; i++) {
        const spanNum = 24 / colCount;
        colCode += '  <a-col :span="' + spanNum + '"/>\n';
      }
      colCode += '</a-row>';
      return colCode;
    },
  },
};
</script>
<style scoped>
#components-grid-demo-playground [class~='ant-col'] {
  background: transparent;
  border: 0;
}
#components-grid-demo-playground [class~='ant-col'] > div {
  background: #00a0e9;
  height: 120px;
  line-height: 120px;
  font-size: 13px;
}
#components-grid-demo-playground pre {
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 13px;
  padding: 8px 16px;
}
</style>
```
