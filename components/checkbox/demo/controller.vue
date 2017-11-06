<template>
  <div>
    <p :style="{ marginBottom: '20px' }">
      <Checkbox
        :checked="checked"
        :disabled="disabled"
        @change="onChange"
      >
        {{label}}
      </Checkbox>
    </p>
    <p>
      <AntButton
        type="primary"
        size="small"
        @click="toggleChecked"
      >
        {{!checked ? 'Check' : 'Uncheck'}}
      </AntButton>
      <AntButton
        :style="{ marginLeft: '10px' }"
        type="primary"
        size="small"
        @click="toggleDisable"
      >
        {{!disabled ? 'Disable' : 'Enable'}}
      </AntButton>
    </p>
  </div>
</template>
<script>
import { Checkbox, Button } from 'antd'
export default {
  data () {
    return {
      checked: true,
      disabled: false,
    }
  },
  computed: {
    label () {
      const { checked, disabled } = this
      return `${checked ? 'Checked' : 'Unchecked'}-${disabled ? 'Disabled' : 'Enabled'}`
    },
  },
  methods: {
    toggleChecked () {
      this.checked = !this.checked
    },
    toggleDisable () {
      this.disabled = !this.disabled
    },
    onChange (e) {
      this.checked = e.target.checked
    },
  },
  components: {
    Checkbox,
    AntButton: Button,
  },
}
</script>
