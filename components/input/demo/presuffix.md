<cn>
#### 前缀和后缀
在输入框上添加前缀或后缀图标。
</cn>

<us>
#### prefix and suffix
Add prefix or suffix icons inside input.
</us>

```tpl
<template>
  <div class="components-input-demo-presuffix">
    <a-input placeholder="Basic usage" v-model="userName" ref="userNameInput">
      <a-icon slot="prefix" type="user" />
      <a-tooltip slot="suffix" title="Extra information">
        <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
      </a-tooltip>
    </a-input>
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
<style scoped>
  .components-input-demo-presuffix .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }
  .components-input-demo-presuffix .anticon-close-circle:hover {
    color: #999;
  }
  .components-input-demo-presuffix .anticon-close-circle:active {
    color: #666;
  }
</style>
```
