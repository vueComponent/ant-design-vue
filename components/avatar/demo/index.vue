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
      <avatar shape="square" size="large" :styles="{'backgroundColor': color}">{{avatarValue}}</avatar>
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

const UserList = ['U', 'Lucy', 'Tom', 'Edward']
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
export default {
  data () {
    return {
      avatarValue: UserList[0],
      color: colorList[0],
    }
  },
  methods: {
    changeValue () {
      const index = UserList.indexOf(this.avatarValue)
      this.avatarValue = index < UserList.length - 1 ? UserList[index + 1] : UserList[0]
      this.color = index < colorList.length - 1 ? colorList[index + 1] : colorList[0]
    },
  },
  components: {
    Avatar,
    AntButton: Button,
    Badge,
  },
}
</script>
