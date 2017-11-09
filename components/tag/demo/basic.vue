<template>
  <div>
    <Tag>Tag 1</Tag>
    <Tag><a href="https://github.com/vueComponent/ant-design">Link</a></Tag>
    <Tag closable @close="log">Tag 2</Tag>
    <Tag closable @close="preventDefault">Prevent Default</Tag>
  </div>
</template>
<script>
import { Tag } from 'antd'
export default {
  methods: {
    log (e) {
      console.log(e)
    },
    preventDefault (e) {
      e.preventDefault()
      console.log('Clicked! But prevent default.')
    },
  },
  components: {
    Tag,
  },
}
</script>
