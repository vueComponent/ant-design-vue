<template>
  <div v-html="marked($slots.default[0].text.trim() || '')" />
</template>
<script>
import marked from 'marked'
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true,
})
export default {
  name: 'md',
  data () {
    return {
      marked,
    }
  },
}
</script>
