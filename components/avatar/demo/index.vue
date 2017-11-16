<template>
  <div>
    <div>
      <avatar size="large" icon="user"/>
      <avatar icon="user"/>
      <avatar size="small" icon="user"/>
    </div>
    <br/>
    <div>
      <avatar shape="square" size="large" icon="user" />
      <avatar shape="square" icon="user" />
      <avatar shape="square" size="small" icon="user" />
    </div>
    <br/>
    <div>
      <avatar icon="user" />
      <avatar>U</avatar>
      <avatar>USER</avatar>
      <avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <avatar :styles="{ color: '#f56a00', backgroundColor: '#fde3cf' }">U</avatar>
      <avatar :styles="{ backgroundColor: '#87d068' }" icon="user" />
    </div>
    <br/>
    <div>
      <avatar shape="square" size="large">{{avatarValue}}</avatar>
      <AntButton @click="changeValue">改变</AntButton>
    </div>
    <br/>
    <div>
      <Badge count=1><Avatar shape="square" icon="user" /></Badge>
      <br/>
      <Badge dot><Avatar shape="square" icon="user" /></Badge>
    </div>
  </div>
</template>
<script>
import '../style'
import { Avatar, Button, Badge } from 'antd/index'
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
    Badge,
  },
}
</script>
