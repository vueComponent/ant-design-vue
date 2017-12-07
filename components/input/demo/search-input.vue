<template>
  <Search
    placeholder="input search text"
    style="width: 200px"
    @search="onSearch"
  />
</template>
<script>

import { Input } from 'antd'
export default {
  methods: {
    onSearch (value) {
      console.log(value)
    },
  },
  components: {
    Search: Input.Search,
  },
}
</script>
