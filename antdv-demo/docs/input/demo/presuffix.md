<cn>
#### 前缀和后缀
在输入框上添加前缀或后缀图标。
</cn>

<us>
#### prefix and suffix
Add prefix or suffix icons inside input.
</us>

```vue
<template>
  <div class="components-input-demo-presuffix">
    <a-input ref="userNameInput" v-model="userName" placeholder="Basic usage">
      <a-icon slot="prefix" type="user" />
      <a-tooltip slot="suffix" title="Extra information">
        <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
      </a-tooltip>
    </a-input>
    <br />
    <br />
    <a-input prefix="￥" suffix="RMB" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
    };
  },
  methods: {
    emitEmpty() {
      this.$refs.userNameInput.focus();
      this.userName = '';
    },
  },
};
</script>
```
