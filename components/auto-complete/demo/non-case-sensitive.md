<cn>
#### 不区分大小写
不区分大小写的 AutoComplete
</cn>

<us>
#### Non-case-sensitive AutoComplete
A non-case-sensitive AutoComplete
</us>

```tpl
<template>
  <a-auto-complete
    :dataSource="dataSource"
    style="width: 200px"
    placeholder="input here"
    :filterOption="filterOption"
  />
</template>
<script>
  export default {
    data() {
      return {
        dataSource: ['Burns Bay Road', 'Downing Street', 'Wall Street'],
      };
    },
    methods: {
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
      },
    },
  };
</script>
```
