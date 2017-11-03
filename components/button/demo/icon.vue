<template>
  <div>
    <AntButton type="primary" shape="circle" icon="search" />
    <AntButton type="primary" icon="search">Search</AntButton>
    <AntButton shape="circle" icon="search" />
    <AntButton icon="search">Search</AntButton>
    <br />
    <AntButton shape="circle" icon="search" />
    <AntButton icon="search">Search</AntButton>
    <AntButton type="dashed" shape="circle" icon="search" />
    <AntButton type="dashed" icon="search">Search</AntButton>
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
