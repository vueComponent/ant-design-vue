<template>
  <div>
    <AntButton :type="this.type" @click="handleClick" class="test">
      primary
    </AntButton>
    <AntButton @mouseover="handleClick" @mouseout="handleClick">Default</AntButton>
    <AntButton type="dashed">Dashed</AntButton>
    <AntButton type="danger">Danger</AntButton>
    <br />
    <AntButton type="primary" shape="circle" icon="search" />
    <AntButton type="primary" icon="search">Search</AntButton>
    <AntButton shape="circle" icon="search" />
    <AntButton icon="search">Search</AntButton>
    <br />
    <AntButton shape="circle" icon="search" />
    <AntButton icon="search">Search</AntButton>
    <AntButton type="dashed" shape="circle" icon="search" />
    <AntButton type="dashed" icon="search">Search</AntButton>
    <div>
      <AntButton type="primary">Primary</AntButton>
      <AntButton type="primary" disabled>Primary(disabled)</AntButton>
      <br />
      <AntButton>Default</AntButton>
      <AntButton disabled>Default(disabled)</AntButton>
      <br />
      <AntButton>Ghost</AntButton>
      <AntButton disabled>Ghost(disabled)</AntButton>
      <br />
      <AntButton type="dashed">Dashed</AntButton>
      <AntButton type="dashed" disabled>Dashed(disabled)</AntButton>
    </div>
    <div :style="{background: 'rgb(190, 200, 200)', padding: '26px 16px 16px'}">
      <AntButton type="primary" ghost>Primary</AntButton>
      <AntButton ghost>Default</AntButton>
      <AntButton type="dashed" ghost>Dashed</AntButton>
      <AntButton type="danger" ghost>danger</AntButton>
    </div>
    <div>
      <AntButton type="primary" loading>
        Loading
      </AntButton>
      <AntButton type="primary" size="small" loading>
        Loading
      </AntButton>
      <br />
      <AntButton type="primary">
        Click me!
      </AntButton>
      <AntButton type="primary" icon="poweroff">
        Click me!
      </AntButton>
      <br />
      <AntButton shape="circle" loading />
      <AntButton type="primary" shape="circle" loading />
    </div>
    <div>
      <ButtonGroup>
        <AntButton>Cancel</AntButton>
        <AntButton type="primary">OK</AntButton>
      </ButtonGroup>
      <ButtonGroup size="large">
        <AntButton disabled>L</AntButton>
        <AntButton disabled>M</AntButton>
        <AntButton disabled>R</AntButton>
      </ButtonGroup>
      <ButtonGroup size="small">
        <AntButton type="primary">L</AntButton>
        <AntButton>M</AntButton>
        <AntButton>M</AntButton>
        <AntButton type="dashed">R</AntButton>
      </ButtonGroup>
    </div>
  </div>
</template>
<script>
import '../style'
import { Button } from 'antd'
const ButtonGroup = Button.Group
export default {
  data () {
    return {
      type: 'primary',
    }
  },
  methods: {
    handleClick (event) {
      console.log(event)
      this.type = this.type === 'primary' ? 'danger' : 'primary'
    },
  },
  components: {
    AntButton: Button,
    ButtonGroup,
  },
}
</script>
