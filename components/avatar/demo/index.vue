<template>
  <div>
    <div>
      <a-avatar size="large" icon="user"/>
      <a-avatar icon="user"/>
      <a-avatar size="small" icon="user"/>
    </div>
    <br/>
    <div>
      <a-avatar shape="square" size="large" icon="user" />
      <a-avatar shape="square" icon="user" />
      <a-avatar shape="square" size="small" icon="user" />
    </div>
    <br/>
    <div>
      <a-avatar icon="user" />
      <a-avatar>U</a-avatar>
      <a-avatar>USER</a-avatar>
      <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <a-avatar :styles="{ color: '#f56a00', backgroundColor: '#fde3cf' }">U</a-avatar>
      <a-avatar :styles="{ backgroundColor: '#87d068' }" icon="user" />
    </div>
    <br/>
    <div>
      <a-avatar shape="square" size="large" :styles="{'backgroundColor': color}">{{avatarValue}}</a-avatar>
      <a-button @click="changeValue">改变</a-button>
    </div>
    <br/>
    <div>
      <a-badge count=1><a-avatar shape="square" icon="user" /></a-badge>
      <br/>
      <a-badge dot><a-avatar shape="square" icon="user" /></a-badge>
    </div>
  </div>
</template>
<script>
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
}
</script>
