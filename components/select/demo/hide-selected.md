<cn>
#### 隐藏已选择选项
隐藏下拉列表中已选择的选项。
</cn>

<us>
#### Hide Already Selected
Hide already selected options in the dropdown.
</us>

```tpl
<template>
  <a-select
    mode="multiple"
    placeholder="Inserted are removed"
    :value="selectedItems"
    @change="handleChange"
    style="width: 100%"
  >
    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
      {{item}}
    </a-select-option>
  </a-select>
</template>
<script>
  const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
  export default {
    data() {
      return {
        selectedItems: [],
      };
    },
    computed: {
      filteredOptions() {
        return OPTIONS.filter(o => !this.selectedItems.includes(o));
      },
    },
    methods: {
      handleChange(selectedItems) {
        this.selectedItems = selectedItems;
      },
    },
  };
</script>
```
