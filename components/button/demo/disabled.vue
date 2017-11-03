<template>
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
</template>
<script>
import { Button } from 'antd'
export default {
  components: {
    AntButton: Button,
  },
}
</script>
