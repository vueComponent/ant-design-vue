<template>
  <div>
    <div>
      <avatar size="large" icon="user"/>
      <avatar icon="user"/>
      <avatar size="small" icon="user"/>
    </div>
    <div>
      <avatar shape="square" size="large" icon="user" />
      <avatar shape="square" icon="user" />
      <avatar shape="square" size="small" icon="user" />
    </div>
    <div>
      <avatar icon="user" />
      <avatar>U</avatar>
      <avatar>USER</avatar>
      <avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <avatar :style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">U</avatar>
      <avatar :style="{ backgroundColor: '#87d068' }" icon="user" />
    </div>
    <div>
      <avatar shape="square" size="large">{{avatarValue}}</avatar>
      <AntButton @click="changeValue">改变</AntButton>
    </div>
  </div>
</template>
<script>
import '../style'
import { Avatar, Button } from 'antd/index'
export default {
  data () {
    return {
      avatarValue: 'current',
    }
  },
  methods: {
    changeValue () {
      this.avatarValue = 'changed'
    },
  },
  components: {
    Avatar,
    AntButton: Button,
  },
}
</script>
