<template>
  <div>
    <CheckableTag v-model="checked1" @change="handleChange">Tag1</CheckableTag>
    <CheckableTag v-model="checked2" @change="handleChange">Tag2</CheckableTag>
    <CheckableTag v-model="checked3" @change="handleChange">Tag3</CheckableTag>
  </div>
</template>
<script>
import { Tag } from 'antd'
export default {
  data () {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
    }
  },
  methods: {
    handleChange (checked) {
      console.log(checked)
    },
  },
  components: {
    Tag,
    CheckableTag: Tag.CheckableTag,
  },
}
</script>
