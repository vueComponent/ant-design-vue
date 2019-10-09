<cn>
#### 扩展菜单
使用 `dropdownRender` 对下拉菜单进行自由扩展。
</cn>

<us>
#### Custom dropdown
Customize the dropdown menu via `dropdownRender`.
</us>

```tpl
<template>
  <a-select defaultValue="lucy" style="width: 120px">
    <div slot="dropdownRender" slot-scope="menu">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0;" />
      <div style="padding: 8px; cursor: pointer;"><a-icon type="plus" /> Add item</div>
    </div>
    <a-select-option value="jack">Jack</a-select-option>
    <a-select-option value="lucy">Lucy</a-select-option>
  </a-select>
</template>
<script>
  export default {
    data: () => ({ console: console }),
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
  };
</script>
```
