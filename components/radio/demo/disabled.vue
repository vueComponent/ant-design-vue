<template>
  <div>
    <Radio :defaultChecked="false" :disabled="disabled">Disabled</Radio>
    <br />
    <Radio defaultChecked :disabled="disabled">Disabled</Radio>
    <div :style="{ marginTop: 20 }">
      <a-button type="primary" @click="toggleDisabled">
        Toggle disabled
      </a-button>
    </div>
  </div>
</template>
<script>
import { Radio, Button } from 'antd'
export default {
  data () {
    return {
      disabled: true,
    }
  },
  methods: {
    toggleDisabled () {
      this.disabled = !this.disabled
    },
  },
  components: {
    Radio,

  },
}
</script>
