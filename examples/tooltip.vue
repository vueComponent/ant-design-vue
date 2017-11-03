<template>
  <tool-tip
    placement="top"
    title="nihaoaaaaaaaaaaaaaaaaaaaaa">
    <h1 @click="boom" style="display: inline-block">This is just a test, put your cursor here</h1>
  </tool-tip>
</template>

<script>
  import { ToolTip } from '../components'
	export default {
		name: '',
		data() {
			return {}
		},
    methods: {
		  boom() {
		    console.info(23333)
      }
    },
    components: {
		  ToolTip
    }
	}
</script>

<style scoped>

</style>
