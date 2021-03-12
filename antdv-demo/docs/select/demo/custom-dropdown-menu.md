<cn>
#### 扩展菜单
使用 `dropdownRender` 对下拉菜单进行自由扩展。
</cn>

<us>
#### Custom dropdown
Customize the dropdown menu via `dropdownRender`.
</us>

```vue
<template>
  <a-select default-value="lucy" style="width: 120px">
    <div slot="dropdownRender" slot-scope="menu">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0;" />
      <div
        style="padding: 4px 8px; cursor: pointer;"
        @mousedown="e => e.preventDefault()"
        @click="addItem"
      >
        <a-icon type="plus" /> Add item
      </div>
    </div>
    <a-select-option v-for="item in items" :key="item" :value="item">
      {{ item }}
    </a-select-option>
  </a-select>
</template>
<script>
let index = 0;
export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data: () => ({ items: ['jack', 'lucy'] }),
  methods: {
    addItem() {
      console.log('addItem');
      this.items.push(`New item ${index++}`);
    },
  },
};
</script>
```
