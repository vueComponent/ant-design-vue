
<cn>
#### 智能提示
输入框自动完成功能，下面是一个账号注册表单的例子。
推荐使用 [AutoComplete](/components/auto-complete/) 组件。
</cn>

<us>
#### Automatic completion
Automatic completion of select input.
Using the [AutoComplete](/components/auto-complete/) component is strongly recommended instead as it is more flexible and capable.
</us>

```html
<template>
  <a-select mode="combobox" style="width: 200px" @change="handleChange" :filterOption="false"
      placeholder="Enter the account name">
    <a-select-option v-for="opt in options" :key="opt">{{opt}}</a-select-option>
  </a-select>
</template>
<script>
const domains = ['gmail.com', '163.com', 'qq.com']
export default {
  data() {
    return {
      options: [],
    }
  },
  methods: {
    handleChange(value) {
      if (!value || value.indexOf('@') >= 0) {
        this.options = [];
      } else {
        this.options = domains.map(domain => `${value}@${domain}`)
      }
    }
  }
}
</script>
```

