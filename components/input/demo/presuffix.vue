<template>
  <AntInput placeholder="Basic usage" v-model="userName" ref="userNameInput">
    <Icon slot="prefix" type="user" />
    <Icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty" />
  </AntInput>
</template>
<script>

import { Input, Icon } from 'antd'
export default {
  data () {
    return {
      userName: '',
    }
  },
  methods: {
    emitEmpty () {
      this.$refs.userNameInput.focus()
      this.userName = ''
    },
  },
  components: {
    AntInput: Input,
    Icon,
  },
}
</script>
<style>
.anticon-close-circle {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  font-size: 12px;
}
.anticon-close-circle:hover {
  color: #999;
}
.anticon-close-circle:active {
  color: #666;
}
</style>
