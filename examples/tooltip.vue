<template>
  <div>
    <tool-tip
      placement="top"
      :title="showText">
      <h1 @click="boom" style="display: inline-block">This is just a test, put your cursor here</h1>
    </tool-tip>
  </div>
</template>

<script>
  import { ToolTip } from '../components'
	export default {
		name: '',
		data() {
			return {
        show: true,
        showText: '你好啊，23'
      }
		},
    methods: {
		  boom() {
		    this.showText += '3'
      }
    },
    components: {
		  ToolTip
    }
	}
</script>
