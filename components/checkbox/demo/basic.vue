<template>
  <div>
    <a-checkbox @change="onChange">Checkbox</a-checkbox>
  </div>
</template>
<script>
import { Checkbox } from 'antd'
export default {
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.checked}`)
    },
  },
  components: {
    Checkbox,
  },
}
</script>
