<cn>
#### 控制关闭状态
通过 `visible` 属性控制关闭状态。
</cn>

<us>
#### Controlled
By using the `visible` prop, you can control the close state of Tag.
</us>

```tpl
<template>
  <div>
    <a-tag closable v-model="visible">
      Movies
    </a-tag>
    <br />
    <a-button size="small" @click="()=>{this.visible = !this.visible}">
      Toggle
    </a-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible: true,
      };
    },
  };
</script>
```
