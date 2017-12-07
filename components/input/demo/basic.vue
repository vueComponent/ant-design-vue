<template>
<div>
  <AntInput placeholder="Basic usage" v-model="value"/>
  <AntInput placeholder="Basic usage" :value="value" @change="change"/>
  <AntInput placeholder="Basic usage" defaultValue="mysite"/>
</div>

</template>
<script>

import { Input } from 'antd'
export default {
  data () {
    return {
      value: '12345',
    }
  },
  methods: {
    change (e) {
      this.value = e.target.value
    },
  },
  components: {
    AntInput: Input,
  },
}
</script>
